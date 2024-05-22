                         
<br/>
<div align="center">
<a href="https://github.com/ShaanCoding/ReadME-Generator">
<img src="https://github.com/adadarohan/schedule_generator/blob/main/frontend/public/schedule%20logo.png?raw=true" alt="Logo" width="80" height="80">
</a>
<h3 align="center">Illini Class Scheduler</h3>
<p align="center">
A better way to schedule your college classes.
<br/>
<br/>
<a href="https://github.com/adadarohan/schedule_generator"><strong>Explore the docs »</strong></a>
<br/>
<br/>
<a href="https://www.illiniclassscheduler.com/">View Demo .</a>  
<a href="https://github.com/adadarohan/schedule_generator/issues/new">Report Bug .</a>
<a href="https://github.com/adadarohan/schedule_generator/issues/new?labels=enhancement">Request Feature</a>
</p>
</div>

 ## About The Project

![Product Screenshot](https://github.com/adadarohan/schedule_generator/blob/main/frontend/public/product_screenshot.png?raw=true)

Do you hate getting up for 8 am classes in the dead of winter? Or skipping a favourite meal because you have to rush to the next class?

Now optimize your class schedule effortlessly through IlliniClassScheduler.com, a high-performance schedule generator I've been developing! 

Tailored specifically for the UIUC community, choose class timings, favourite professors, breaks, distances between lectures and more – all through an intuitive interface designed to make your academic life easier.
 ### Built With

This project wouldn't have been possible without the great minds behind - 

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com/)
- [Open Street Maps](https://www.openstreetmap.org/)
- [PyPy](https://www.pypy.org/)
 ## Getting Started

### Frontend
Hosted on AWS CloudFront through S3 site hosting. 

To run the frontend, run the following commands - 
```
cd frontend
npm install
npm run dev
```

To deploy the frontend, run the following command - 

`npm run deploy`

This command builds the static files and uploads them to an S3 bucket using the AWS CLI. After running the command, go to AWS CloudFront and invalidate the deployment.

### Backend
The backend is hosted on AWS Lambda functions and called using AWS Lambda function URLs.

To deploy the backend, run the following command and replace `{directory}` with the name of the folder that you want to deploy.

```
cd backend
./deploy.sh {directory}
```
 ## Roadmap

- [x] Integrate Location Data
- [x] Integrate Rate my Prof
- [ ] Export to Calendar Feature
- [ ] Swap classes / find what fits best in schedule
- [ ] Computer schedule right before your time ticket and email you
- [ ] Add support for multiple universities

See the [open issues](https://github.com/adadarohan/schedule_generator/issues) for a full list of proposed features (and known issues).
 ## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
 ## License

Distributed under the MIT License. See [MIT License](https://opensource.org/licenses/MIT) for more information.
 ## Contact

Rohan Kapur - rohan21@illinois.edu
