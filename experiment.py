from voyager import Voyager

# You can also use mc_port instead of azure_login, but azure_login is highly recommended
azure_login = {
    "client_id": "102fbeb2-2ed7-4a82-8392-d2da26802371",
    "redirect_url": "https://127.0.0.1/auth-response",
    "secret_value": "FUV8Q~Fdc.D-Mv0AysXv.A6LwAp-Qb37YNOn1cIL",
    "version": "fabric-loader-0.14.18-1.19", # the version Voyager is tested on
}
openai_api_key = "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"

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