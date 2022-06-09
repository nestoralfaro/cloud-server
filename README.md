# Cloud Server Project

The following is a mock-up cloud application built with `NodeJS` and `Handlebars`. You are able to delete directories, files, create directories, navigate through the directories, upload and download files, as well as viewing the files that your browser supports–e.g., .txt, .png, etc.

Clone the repository and while in the application's directory run `npm run start` to execute it on your local machine. All the files uploaded will be stored in the `files` directory.

## Demo
![cloud-server-demo](https://user-images.githubusercontent.com/83131937/172952053-0f8a3b06-895f-47c7-b68d-c954fff27710.gif)

### Config options (`lib/config.js`)
- `cloudDir` must be the absolute path to the files directory that will be your cloud.
- `maxFileSizeToUpload` is the file size limite in bytes.
