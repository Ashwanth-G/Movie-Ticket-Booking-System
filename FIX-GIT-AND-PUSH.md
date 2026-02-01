# Fix Git Repo Location and Push to GitHub

Your repo was initialized in **C:\Users\ashwa** (home) instead of the project folder. Follow these steps.

## Step 1: Remove the repo from your home directory

In **Command Prompt** or **PowerShell**:

```cmd
rmdir /s /q C:\Users\ashwa\.git
```

Or in PowerShell:

```powershell
Remove-Item -Recurse -Force C:\Users\ashwa\.git
```

This removes the Git repo from your user folder so it won’t track your whole profile.

---

## Step 2: Open the project folder (and switch drive)

In **Command Prompt**, use `/d` so the drive changes to D::

```cmd
cd /d "d:\Users\Documents\Projects\MovieTicketBookingSystem"
```

In **PowerShell**:

```powershell
Set-Location "d:\Users\Documents\Projects\MovieTicketBookingSystem"
```

Check you’re in the right place (you should see `backend`, `frontend`, `.gitignore`, etc.):

```cmd
dir
```

---

## Step 3: Init and push from the project folder

Run these **one by one** from the project folder:

```cmd
git init
git remote add origin https://github.com/Ashwanth-G/Movie-Ticket-Booking-System.git
git add -A
git status
```

`git status` should list only project files (backend, frontend, docs, etc.). If you see `AppData`, `.android`, etc., you’re still in the wrong directory; go back to Step 2.

Then:

```cmd
git commit -m "Movie Ticket Booking System - MERN stack with admin, bookings, showtimes, trailers"
git branch -M main
git push -u origin main
```

---

## Summary

| What went wrong | What to do |
|-----------------|------------|
| `git init` ran in `C:\Users\ashwa` | Delete `C:\Users\ashwa\.git` |
| `cd` to a different drive didn’t switch drive | Use `cd /d "d:\...\MovieTicketBookingSystem"` in cmd |
| `git add -A` staged the whole user folder | Run `git add -A` only after `cd` into the project and `git init` there |

After Step 1 and 2, the new `git init` creates `.git` inside **MovieTicketBookingSystem**, and push will contain only the project.
