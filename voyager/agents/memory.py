import os
import json
from datetime import datetime
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma

class MemoryAgent:
    def __init__(self, ckpt_dir):
        self.ckpt_dir = ckpt_dir
        self.embedding_function = OpenAIEmbeddings(deployment="embedding")
        self.memory_db = self.init_memory_db()
        self.memory_data_path = f"{self.ckpt_dir}/memory/memory_data.json"
        self.load_memory()
        self.visit_history = {}  # Stores the frequency and recency of visits

    def init_memory_db(self):
        return Chroma(
            collection_name="memory_vectordb",
            embedding_function=self.embedding_function,
            persist_directory=f"{self.ckpt_dir}/memory/vectordb",
        )

    def update_memory(self, action, position):
        state_description = f"Action: {action}, Position: {position}"
        #fix embedding
        embedding = self.embedding_function.embed_documents([state_description])[0]
        timestamp = datetime.now().isoformat()
        # Add the state description as text along with its embedding
        self.memory_db.add_texts(
            texts=[state_description],
            embeddings=[embedding],
            metadatas=[{
                'state_description': state_description,
                'timestamp': timestamp,
                'position': position,
                'action': action
            }]
        )
        self.update_visit_history(position, timestamp)
        self.persist_memory()

    def update_visit_history(self, position, timestamp):
        # Check if position is within 50 units of any visited position
        for visited_position in self.visit_history.keys():
            if self.is_within_radius(position, visited_position, 50):
                self.visit_history[visited_position]['count'] += 1
                self.visit_history[visited_position]['last_visit'] = timestamp
                return

        # If position is not within radius of any visited position, add it as a new entry
        self.visit_history[position] = {'count': 1, 'last_visit': timestamp}

    def is_within_radius(self, position1, position2, radius):
        x1, y1, z1 = map(float, position1.split(','))
        x2, y2, z2 = map(float, position2.split(','))
        distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) ** 0.5
        return distance <= radius

    def recall_memory(self, query):
        query_embedding = self.embedding_function.embed_query(query)
        return self.memory_db.nearest(query_embedding, n=1)

    def calculate_novelty_score(self, position):
        # Convert tuple back to string format for comparison
        position_str = ','.join(map(str, position))
        if position_str not in self.visit_history:
            return float('inf')  # Max novelty for unvisited locations
        visit_data = self.visit_history[position_str]
        return 1 / (visit_data['count'] + 0.1)  # Inverse of visit frequency

    def guide_exploration(self, current_state, nearby_positions):
        # Convert dictionary positions to tuples for hashing
        hashable_positions = [(pos['x'], pos['y'], pos['z']) for pos in nearby_positions]

        novelty_scores = {pos: self.calculate_novelty_score(pos) for pos in hashable_positions}
        # Choose the position with the highest novelty score
        next_position = max(novelty_scores, key=novelty_scores.get)
        return next_position


    def persist_memory(self):
        # Persisting visit history
        with open(self.memory_data_path, 'w') as file:
            memory_data = {
                'visit_history': self.visit_history
            }
            json.dump(memory_data, file, ensure_ascii=False, indent=4)

        # Persisting the vector store state (handled internally by Chroma)
        self.memory_db.persist()

    def load_memory(self):
        if os.path.exists(self.memory_data_path):
            with open(self.memory_data_path, 'r') as file:
                memory_data = json.load(file)
                self.visit_history = memory_data.get('visit_history', {})

