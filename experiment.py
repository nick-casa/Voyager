from voyager import Voyager
import openai
import os

from dotenv import load_dotenv
load_dotenv()

azure_login = {
    "client_id": os.environ["AZURE_CLIENT_ID"],
    "redirect_url": "https://127.0.0.1/auth-response",
    "secret_value": os.environ["AZURE_SECRET"],
    "version": "fabric-loader-0.14.18-1.19", # the version Voyager is tested on
}

# First instantiate Voyager with skill_library_dir.
voyager = Voyager(
    server_port=3001,
    azure_login=azure_login,
    #mc_port=50285,
    openai_api_key=os.environ["OPENAI_API_KEY"],
    #skill_library_dir="./ckpt/test3", # Load a learned skill library.
    ckpt_dir="./ckpt/test4", # Feel free to use a new dir. Do not use the same dir as skill library because new events will still be recorded to ckpt_dir.
    resume=False # Do not resume from a skill library because this is not learning.
)

# start lifelong learning
voyager.learn()