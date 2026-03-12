# console

Administation console for abcdesktop.  
console communicates with pyos which is the abcdesktop control plane, API services.

## Prerequisites

You need to have at least a 3.3 abcdesktop session running.  
To access console, open your browser and connect to `http://[your-abcdesktop-address]:30443/console`

## Table of Contents

1. [Desktops management](#desktops-management)
2. [Applications management](#applications-management)
4. [Ban Users](#ban-users)
    - [From IP](#from-ip)
    - [From Login](#from-login)

## Desktops management

Once a desktop has been created on your abcdesktop session, you can find it on the desktops page of console.
![desktops-page](img/console_desktop_1.png)  

### Gathering more informations

If you want more informations about the desktop, such as real time resources usage, applications containers currently running or the diffrents labels, you can click on the desktop name.
![more-infos-desktop-1](img/console_desktop_more_info.png)
![more-infos-desktop-2](img/console_desktop_more_info_2.png)
![more-infos-desktop-3](img/console_desktop_more_info_3.png)
![more-infos-desktop-4](img/console_desktop_more_info_4.png)

### Deleting desktop

To delete a desktop you just have to click on the red trash at the end of the line.

## Applications management

console offers the possibility to manage the apps through the applications page.
![application-page](img/console_applications_1.png)

### Add application

On the application page, click on the blue + button. You will have two possibilities :

- Add from the applications store
- Add from JSON file

#### Add from application store

Through this modal window, you can add application by exploring the application store, click on the app you want to add, its background color should change to indicate that the app has been selected, and finally click on the Add button.  
Also, as there are quite a few applications, you can use the search bar on the to right corner to help you find the app you are searching for.

![app-store](img/app_store_modal.png) 
![app-store-select](img/app_store_modal_select.png)

Note that clicking on the JSON button will open a modal that allows you to add applications from JSON file as shown below.

#### Add from JSON file

Through this modal window, you can add applications by uploading a JSON file or by copy-pasting directly the JSON raw content in the text area.

![add-json-file](img/add_json_file.png) 
![add-raw-json](img/add_raw_file.png)

Note that the github button will send you directly to the abcdesktop github applications page.

### Delete application

To delete applications one by one you can click on the red trash at the end oh the line on the row where the app you want to delete is located.  
Or if you want to delete several applications at the same time you can select them and click on the red trash button above the table to delete all the selected applications.
![apps-select](img/console_applications_select.png)

### Gathering more informations

If you want to get more informations about an application, just click on the name of the app to display the whole json file of the app.
![app-infos](img/app_infos.png)

## Ban users

As an admin, you will probably face the necessity to ban users for various reasons. You can both ban from ip and login

### From IP

To ban a user, you have to click on the blue + button and enter the IP you want to ban. IPs are IPV4 format X.X.X.X
![ban-ip-modal](img/ban_ip_modal.png)
![ban-ip-page](img/ban_ip_page.png)

### From login

To ban a user, you have to click on the blue + button and enter the login you want to ban.
![ban-login-modal](img/ban_login_modal.png)
![ban-login-page](img/ban_login_page.png)