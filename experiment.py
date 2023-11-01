from voyager import Voyager

# First instantiate Voyager with skill_library_dir.
voyager = Voyager(
    #azure_login=azure_login,
    mc_port=56580,
    openai_api_key=openai_api_key,
    skill_library_dir="./skill_library/trial1", # Load a learned skill library.
    #ckpt_dir="./ckpt", # Feel free to use a new dir. Do not use the same dir as skill library because new events will still be recorded to ckpt_dir.
    resume=False, # Do not resume from a skill library because this is not learning.
)
# start lifelong learning
voyager.learn()