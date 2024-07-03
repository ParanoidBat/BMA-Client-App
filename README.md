This is a React Native App made for the [BMA attendance system](https://github.com/ParanoidBat/AttendanceSystem). It uses a [plugin](https://github.com/ParanoidBat/Capacitor-TCP-Plugin) to perform TCP communication between itself and the Arduino device.  
## What it does
- It allows you to view real time attendace reports daily and on arbitrary date range.
- It auto calculates salaries based on the un-sanctioned leaves.
- It allows to set **Saturday** as a holiday, which affects the calculated salaries.
- It allows to approve/disapprove leaves, with reasons for either.
## How it works
On startup, you will first register yourself and your organization. The application will save some data on your device that will be used whenever you connect with Arduino device. When you want to setup the Arduino device, you will first need to go to the `Setup` section from the side drawer, then click the `Setup` button on the Arduino device, establish the connection by connecting to the device hotspot. Once the connection is established you will provide the information needed as prompted on the screen.  
When enrolling a new user; you will first enroll the fingerprint on the Arduino device (note that the device needs to be connected to the internet), then in the new user section of the application, you will need to put in the number displayed on the device's screen in the relevant input field along with other information.  

You can find the API [here](https://github.com/ParanoidBat/BMA-API)  

**Note:** If you have a question, you can open an issue and tag it with question or help wanted labels. But do make sure that you have actually read the code and have made some degree of understanding before opening a thread.
