# Task Management App

## LIVE URL :- _[Task Management App](https://task-management-supabase-1a5p.vercel.app/)_

## #Tech Used

1. Framework - Next.JS
2. Lucide Icons - Icons
3. Tailwind CSS - CSS Framework
4. React O Auth - Google Authentication
5. Supabase - For database & cloud storage
6. Moment - to format timestamps
7. Hello Pangeas dnd - for drag & drop
8. ShadCN- UI Library
9. React Day Picker - For calendar date picking
10. Compressor js - to compress image files.
11. Zustand - State Management
12. React PDF - for Pdf viewer
13. React Quill New - For description quill

## #How to run locally

1. first clone or download the repo.
2. Inside the root folder run the command `npm install` to install all the dependencies, if it shows error then run the command `npm install --legacy-peer-deps`. After that make `.env.local` file in root dir.
3. In the .env.local file paste the code below, for this project to run it locally I've provided my .env.local file, so you can run after just installing dependencies.

```
   NEXT_PUBLIC_GOOGLE_CLIENT_KEY= YOUR GOOGLE CONSOLE API KEY

   NEXT_PUBLIC_SUPABASE_SECRET= YOUR SUPABASE SECRET KEY
```

4. After doing everything above mentioned, run the server using `npm run dev`.

## #Features of this application

1. Users can authenticate using google auth & data will be stored in the database.
2. Create Task with title, description, due date, category, status & file upload - image & pdf only.
3. Edit your task.
4. Logout functionality.
5. Drag & Drop your task within the list to other list & it's status will changed automatically.
6. Smooth navigation & interaction, plus all the post feed doesn't get loaded at once, only when user scroll further.
7. You can see all your task in the form of kanban board on board page.
8. You can view pdf files in document viewer & download it too.
9. Image compression

## #Challenge I've faced

## 1.Authentication

1. The main challenge is completing the project but rather to find correct tools for things you want to build.
2. Working with React O Google Auth wasn't very hard.

## 2.Uploading Multiple Files

1. I've worked with uploading files on cloud storage in my chat app, but never with handling multiple files saving them to cloud storage using `input` tag.
2. But I just need to checkout the documentation & stack overflow, it was smooth as butter.
3. Then the problem came with compressing image files because some image files can be huge, maybe more than `5 mbs` & the compression should be done on client side. I used compressor js for it but the problem arised that I can't get `compressorjs` to return the compressed file. I tried with functions, making another component & using hooks like `useState` & `useEffect` but nothing works. That is when the promise came to play, it solved the problem entire, I just have to return resolve on success of compression.

## 3.Updating Task

1. It was really a pain because I was changing the state of todoInfo when clicking on editing todo, but after closing dialog box, it should revert back to prev empty state, but it wasn't happening therefore I have to create timeout function after closing dialog box after 100ms another function setting todoInfo to its initial state executes, thus taking care of the state changes & handling any side effects.


## 4. Drag & Drop

1. I've worked with drag & drop before but doing withing in the list & setting it for two pages was really a challenge. For List & Kanban Board Page, plus disable DnD for mobile screens.

## 5. Updating existing files

1. Uploading new files, deleting old ones was also the challenge to make everything fast & smooth, render it on the users screen as fast as possible. 


## It's a puzzle

1. Why did I say that making something from scratch is like solving a `puzzle`, you have to put piece together in a way that it looks right & meaningful.
