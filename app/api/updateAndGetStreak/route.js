import { NextResponse } from "next/server";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { database } from "@/app/firebase";

export async function POST(req) {
  const data = await req.json();
  const userID = data.userID;

  const userDocRef = doc(collection(database, "users"), userID);
  const userDocSnap = await getDoc(userDocRef);
  const batch = writeBatch(database);

  let streak = -1;
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const lastLoggedIn = new Date(userData.lastLoggedIn);

    const userOffset = data.offset;
    const userLocaleLastLogInTime = new Date(lastLoggedIn - userOffset * 60000);

    const currentUserTime = new Date(new Date() - userOffset * 60000);

    // for testing streak artificially
    // currentUserTime.setHours(userLocaleLastLogInTime.getHours() + 12);

    // Calculate window for when the user can next log in to increase streak
    const tmp = new Date(userLocaleLastLogInTime);
    tmp.setHours(tmp.getHours() + 24);

    const start = new Date(tmp.toDateString());

    tmp.setHours(tmp.getHours() + 24);

    const end = new Date(tmp.toDateString());

    // calculate streak and return it
    streak = userData.streak;
    if (start <= currentUserTime && currentUserTime <= end) {
      streak += 1;
    } else if (currentUserTime > end) {
      streak = 0;
    }

    batch.update(userDocRef, {
      streak: streak,
      lastLoggedIn: new Date().toUTCString(),
    });
  } else {
    batch.set(userDocRef, {
      streak: 0,
      lastLoggedIn: new Date().toUTCString(),
    });
  }

  await batch.commit();

  return new NextResponse(JSON.stringify({ streak: streak }));
}
