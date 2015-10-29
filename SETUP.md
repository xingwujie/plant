# Developer Setup

Copy the [secrets-example.js](lib/config/secrets-example) file to `secrets.js` in the same directory.

Edit the `secrets.js` file and fill in the missing data. You will need to setup an application with Facebook and an account with IBM's Cloudant. At the time of writing this both were free and IBM allowed up to $50/month of Cloudant usage without charge.

## Facebook

(As with any site, the layout and options change over time so these instructions are an approximation.)

* Go to [developers.facebook.com](https://developers.facebook.com/) and on the menus click on `My Apps` and then select `Add a New App`.
* Select a WWW Website.
* Add a name (Plant is good) and click `Create New Facebook App ID`.
* There's a button to the top right to `Skip Quickstart` - hit that.
* You should end up on the Dashboard. From here you want the `App ID` and `App Secret`. Fill those in the `secrets.js` file under `clientID` and `clientSecret`.

## Cloudant

* Setup an account at [Cloudant](https://cloudant.com/)
* In the `secrets.js` file use the same `account` and `password` that you used to register on the Cloudant site.
* For dbName enter anything you want: `plant-dev` is a good choice.
* You don't need to create the DB in the Cloudant dashboard. When the app tries to access your Cloudant account it will create the DB if it can't find it.

## Running the site

* Clone the repo locally.
* As you'd expect: `npm install`
* `npm install -g nodemon`
* Terminal Window #1: `DEBUG=plant:* nodemon index.js`
  * Starts the server on port 3000
* Terminal Window #2: `npm start`
  * Starts the Webpack Dev Server on port 8080
* Navigate: [http://localhost:8080](http://localhost:8080)
