# Push Movie Ticket Booking System to GitHub
# Run this in PowerShell from the project root, or run the commands below manually.

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/Ashwanth-G/Movie-Ticket-Booking-System.git"

Set-Location $PSScriptRoot

if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
}

Write-Host "Adding remote origin (if not set)..."
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    git remote add origin $repoUrl
} else {
    git remote set-url origin $repoUrl
}

Write-Host "Staging all files..."
git add -A

Write-Host "Checking for changes to commit..."
$status = git status --porcelain
if ($status) {
    git commit -m "Movie Ticket Booking System - MERN stack with admin, bookings, showtimes, trailers"
    Write-Host "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    Write-Host "Done! Project pushed to $repoUrl"
} else {
    Write-Host "Nothing to commit. To push existing commits: git push -u origin main"
}
