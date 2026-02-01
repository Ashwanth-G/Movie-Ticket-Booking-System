# Push This Project to GitHub

Your repo: **https://github.com/Ashwanth-G/Movie-Ticket-Booking-System.git**

Git isn’t available in this environment, so run these steps **on your machine** (Git Bash, PowerShell, or Command Prompt where `git` works).

## Option 1: Run the script (PowerShell)

From the project root:

```powershell
.\push-to-github.ps1
```

## Option 2: Run commands manually

In a terminal where `git` works (e.g. Git Bash), from the project root:

```bash
# 1. Initialize repo (only if this folder is not already a git repo)
git init

# 2. Add your GitHub repo as remote
git remote add origin https://github.com/Ashwanth-G/Movie-Ticket-Booking-System.git
# If origin already exists, update it:
# git remote set-url origin https://github.com/Ashwanth-G/Movie-Ticket-Booking-System.git

# 3. Stage all files (respects .gitignore)
git add -A

# 4. Commit
git commit -m "Movie Ticket Booking System - MERN stack with admin, bookings, showtimes, trailers"

# 5. Use main branch and push
git branch -M main
git push -u origin main
```

If the GitHub repo already has commits (e.g. a README), you may need to pull first:

```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git push -u origin main
```

## Auth

- **HTTPS**: When you `git push`, Git will ask for your GitHub username and a **Personal Access Token** (not your password). Create one at: GitHub → Settings → Developer settings → Personal access tokens.
- **SSH**: If you use SSH keys, switch the remote to SSH and push:
  ```bash
  git remote set-url origin git@github.com:Ashwanth-G/Movie-Ticket-Booking-System.git
  git push -u origin main
  ```
