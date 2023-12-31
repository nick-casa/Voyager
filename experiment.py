from voyager import Voyager
import dotenv
import openai
import os
dotenv.load_dotenv()

AZURE_CLIENT_ID = os.environ["AZURE_CLIENT_ID"]
AZURE_SECRET = os.environ["AZURE_SECRET"]

azure_login = {
    "client_id": AZURE_CLIENT_ID,
    "redirect_url": "https://127.0.0.1/auth-response",
    "secret_value": AZURE_SECRET,
    "version": "fabric-loader-0.14.18-1.19", # the version Voyager is tested on
}
azure_openai_creds = {
    "api_base": os.environ["OPENAI_API_BASE"],
    "api_version": "2023-08-01-preview",
    "api_type" : "azure",
    "api_key": os.environ["OPENAI_API_KEY"]
}

# First instantiate Voyager with skill_library_dir.
voyager = Voyager(
    #azure_login=azure_login,
    mc_port=56580,
    #openai_api_key=OPENAI_API_KEY,
    azure_openai_creds=azure_openai_creds,
    skill_library_dir="./skill_library/trial1", # Load a learned skill library.
    #ckpt_dir="./ckpt", # Feel free to use a new dir. Do not use the same dir as skill library because new events will still be recorded to ckpt_dir.
    resume=False, # Do not resume from a skill library because this is not learning.
)
# start lifelong learning
voyager.learn()