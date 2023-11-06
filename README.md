# Helloween Quest Bot

Welcome to the Helloween Quest Bot, a festive Discord bot designed special for [Galxe](https://galxe.com/) to bring the spooky spirit of Halloween to [Galxe server](https://discord.com/channels/824767871183355954)! 
This bot introduces an interactive quest where server members can participate in a story-driven adventure, earn roles such as `Candy Giver`, `Candy Receiver` and `Haunted Story Hero`, and work their way through challenges to complete the quest.

## Features

- **Interactive Story:** Users can engage with a Halloween-themed story, making choices that will determine their path and outcome.
- **Role Management:** The bot assigns and manages custom roles based on user interactions and progress within the quest.
- **Dynamic Responses:** Utilizing custom embeds, buttons, and messages to guide users through the story.
- **Role-Based Access:** Ensures users have the correct roles before allowing them to proceed with the quest.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/alexkat/halloweenBot.git

2. **Install dependencies for bot:**

- **Navigate to the bot's directory and run:**

   ```sh
   npm install

3. **Install dependencies for backend:**

- **Navigate to the backend directory and run:**

   ```sh
   npm install

4. **Configure your bot:**

- **Rename env.example to .env and fill in your Discord bot token and other relevant configuration options.**

   ```sh
   mv env.example .env 

5. **Configure backend:**

- **Rename backend/env.example to backend/.env and fill in your mongoDB config and other relevant configuration options.**

   ```sh
   mv backend/env.example backend/.env

6. **Run the backend:**

   ```sh
   node app.js

7. **Run the bot:**

   ```
   node index.js

## Usage

After inviting the bot to your server and completing the setup, you can start the quest by using the `/give-candy` command. Make sure you have the `Candy Giver`, `Candy Receiver` and `Haunted Story Hero` roles set up in your server, as these are essential for the quest's progression.

## Commands
`/give-candy @user`: Assign the receiver role to another user (you must have the giver role).
`/halloween`: Access additional Halloween-themed activities (requires Candy Giver and Candy Receiver roles).

## Contributing
We welcome contributions to the Helloween Quest Bot! 
If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License
Distributed under the `MIT License`.

## Acknowledgments
Special thanks to Discord.js for the powerful library that made this bot possible.
Shoutout to all the contributors and community members who have provided feedback and suggestions.
Have a spooktacular time with the Helloween Quest Bot! 🎃