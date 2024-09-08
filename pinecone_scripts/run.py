import json

FILE_NAME = "exercises.json"

# with open(FILE_NAME, 'r') as f:
#     data = json.load(f)


# print(json.dumps(data[0], indent=4))
# for exercise in data:
#     secondary = ", ".join([muscle for muscle in exercise["secondaryMuscles"]])
#     instructions = " ".join([f'{i+1}. {exercise["instructions"][i]}' for i in range(len(exercise["instructions"]))])
#     print(f'The exercise, "{exercise["name"]}," targets the {exercise["target"]} and {exercise["bodyPart"]}. Secondary muscles that it targets are {secondary}. It uses the {exercise["equipment"]}. Instructions for the exercise are: {instructions}')

from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from openai import OpenAI
import os
import json
import uuid

load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index = pc.Index("exerciserag")

# resp = index.delete(delete_all=True, namespace="ns1")


# Load the review data
# data = json.load(open(FILE_NAME))

# processed_data = []
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# # Create embeddings for each review
# for exercise in data:
#     print("Processing", exercise["name"])
#     secondary = ", ".join([muscle for muscle in exercise["secondaryMuscles"]])
#     instructions = " ".join(
#         [
#             f'{i+1}. {exercise["instructions"][i]}'
#             for i in range(len(exercise["instructions"]))
#         ]
#     )
#     augmented_text = f'The exercise, "{exercise["name"]}," targets the {exercise["target"]} and {exercise["bodyPart"]}. Secondary muscles that it targets are {secondary}. It uses the {exercise["equipment"]}. Instructions for the exercise are: {instructions}'

#     response = client.embeddings.create(
#         input=augmented_text, model="text-embedding-3-small"
#     )
#     embedding = response.data[0].embedding
#     processed_data.append(
#         {
#             "values": embedding,
#             "id": str(uuid.uuid4()),
#             "metadata": {
#                 "target": exercise["target"],
#                 "bodyPart": exercise["bodyPart"],
#                 "exerciseName": exercise["name"],
#                 "instructions": exercise["instructions"]
#             },
#         }
#     )

# json.dump(processed_data, open("processed.json", "w"))

# Insert the embeddings into the Pinecone index
with open("processed.json", "r") as f:
    data = json.load(f)
    processed_data = data

for i in range(0, len(processed_data), 30):
    print("attempting upsert", i, i+30)
    upsert_response = index.upsert(
        vectors=processed_data[i:i+30],
        namespace="ns1",
    )
print(upsert_response)

# Print index statistics
print(index.describe_index_stats())

# gifURL changes every day, so can't put that in metadata

"""
{
    "bodyPart": "waist",
    "equipment": "body weight",
    "gifUrl": "https://v2.exercisedb.io/image/xSZvPkJO7hmUsl",
    "id": "0001",
    "name": "3/4 sit-up",
    "target": "abs",
    "secondaryMuscles": [
        "hip flexors",
        "lower back"
    ],
    "instructions": [
        "Lie flat on your back with your knees bent and feet flat on the ground.",
        "Place your hands behind your head with your elbows pointing outwards.",
        "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
        "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
        "Repeat for the desired number of repetitions."
    ]
}

"""
