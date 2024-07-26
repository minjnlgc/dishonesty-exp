### Requirements

Ensure you have [Node.js](https://nodejs.org/en) version 14 or higher installed on your local machine.

### Development

#### Running the Experiment Locally

To run the experiment on your local machine:

1. Verify that Node.js version 14 or higher is installed.

    ```bash
    node --version
    ```

2. Open your terminal and execute the following command to install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run start
    ```

4. The experiment will be hosted at `http://localhost:3000/` (default).

---
#### Git and GitHub Workflow

**Before Pushing Changes to GitHub Repository**

1. Run `git pull` to get the latest changes.

**Upload Changes to GitHub**

1. Check the status of your files:

    ```bash
    git status
    ```

2. Stage all changes:

    ```bash
    git add --all
    ```

3. Commit your changes with a message:

    ```bash
    git commit -m "Your commit message here"
    ```

4. Push the changes to the GitHub repository:

    ```bash
    git push
    ```

**View Commit History**

1. View the commit log:

    ```bash
    git log
    ```

    - Press `Enter` to scroll down one line at a time.
    - Press `Space` to scroll down one page at a time.
    - Press `q` to quit and return to the command line.

---
Sure, here’s an improved version of the README section:

---
### Integrating with Firebase and Prolific

To integrate your project with Firebase and Prolific, follow these steps:

1. **Initialize Firebase**:
   - Run the following command in your terminal to initialize Firebase:
     ```bash
     firebase init
     ```
   - During the setup, only select `hosting` (the option that mentions GitHub Action as optional) and `firestore`.

2. **Set the Public Directory**:
   - When prompted, set the public directory to:
     ```bash
     packaged/experiment
     ```
   - If you dont have these directory, you could run the shell script: `./build_and_extract.sh` (in windows you can use git bash).  

3. **Create the .env File**:
   - In the root directory of your project, create a file named `.env`.
   - Add the following content to the `.env` file:
     ```bash
     # Firebase Configuration
     API_KEY=your_api_key
     AUTH_DOMAIN=your_auth_domain
     PROJECT_ID=your_project_id
     STORAGE_BUCKET=your_storage_bucket
     MESSAGING_SENDER_ID=your_messaging_sender_id
     APP_ID=your_app_id

     # Prolific
     PROLIFIC_REDIRECT_URL=your_prolific_redirect_url
     ```

4. **Replace Placeholder Values**:
   - Replace `your_api_key`, `your_auth_domain`, `your_project_id`, `your_storage_bucket`, `your_messaging_sender_id`, `your_app_id`, and `your_prolific_redirect_url` with your actual Firebase and Prolific configuration details.

By following these steps, you will successfully integrate Firebase and Prolific with your project.

---

This version provides a clearer and more detailed set of instructions, ensuring that users understand each step of the process.