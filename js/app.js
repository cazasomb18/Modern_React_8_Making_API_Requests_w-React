////////////////////////////////////////////////////////////////////////////////////////////////////
//Fetching Data
	//Overview
		//once user enters search term and hit enter, we will then make a request to the Unsplash API
		//Unsplash API return JSON records that contain info about a bunch of differentr 
		//JSON will then be used to render a big list of images
		//We will then organize these rendered images as a flat list on the screen

	//Unsplash API steps
		//Register as a developer
		//Start a new application
			//if you go over 50 requests you can just start a new account and change the API key(s)
		//Copy your API key for later use
		//on Unsplash portal, open Documentation < Search photos by keyword




////////////////////////////////////////////////////////////////////////////////////////////////////
//Axios vs. Fetch

	//How exactly are we going to make a request from inside our react app?
		//Diagram: it's not job of React lib to make a request to unsplash API, react is only about showing
		//content to users and handling user interaction

			//Making the API request going to be performed by a 3rd party API (axios):

			//React App ==> AJAX Client --> [send me data about pics for 'cars'] --> Unsplash API
			//React App					<--		'HERE'S THE DATA				<--	 Unsplash API

		//Axios --> 3rd party package
			//Handles network requests in a very predictable fashion
		//fetch --> function built into modern browsers
			//Easier to make mistakes, requires more developer's knowledge

	//STEP 1 - Install Axios in project directory --> npm install --save axios

	//STEP 2 - import axios into <App/> component
		//by convention we would normally place the import statement for 3rd party packages/dependencies
		//above import statements that we create

	//STEP 3 - replace console.log(term) with the API call the axios:




////////////////////////////////////////////////////////////////////////////////////////////////////
//Viewing Request Results
	//STEP 3 - replace console.log(term) with the API call the axios: (picking up from above...)
		//from unsplash documentation --> endpoint: GET /search/photos
		//syntax: axios.get(''); --> to make get request 
			//1st arg: address that we'll make a get request to
				//before '/search/photos...' we must place the root url for unsplash
				//(unsplash>documentation>Schema>Location) --> 'https://api.unsplash.com/'
					//full url is this: 'https://api.unsplash.com/search/photos'

			//2nd arg: object that will have a lot of options to customize this request
				//In order to make this request we must first identify ourselves, can do this 2 ways:
					//1: add Authorization header that contains our access key: 'Authorization: Client-ID YOUR_ACCESS_KEY'
					//2: add on access key to query string when we make our request
						//We'll use the Authorization header here
				//Now we have to add a query string in params:
					//params: {query: term}



////////////////////////////////////////////////////////////////////////////////////////////////////
//Handling Requests with Async Await
	//How do we get all this data from the axios request and use it to show a list of images on the screen?

	//Here's what will happen chronologically:
		//1 - Component renders itself one time with ont list of images
		//2 - onSearchSubmit method called
		//3 - Request made to unsplash
		//4 - ...wait...
		//5 - Request complete
		//6 - Set images data on state of App component
		//7 - App component rerenders and shows images

			//***remember: we will use a separate component called ImageList to actually render the images
			//SHORT-TERM GOAL:  have app print out the number of images returned from request

			//By the time we get a response from unsplash we will have already exited the onSearch(){} method
				//In order to get a notification as to when the req. completed we have 2 options:
					//1 - challenging
					//2 - way easier
						//we will do both

		//1 - Promise: Remove ; @ end of get request, replace with :
			.then( response () => {console.log(response.data.results)});/*<-- like so*/
		
		// 2 - Async Await syntax: @ beginning of onSeardhSubmit method add 'async': 
			async onSearchRequest(){} /*<-- like so*/

			//a - underneath first line of method we declare response
			const response = await axios.get('https://api.unsplash.com/search/photos/', {}) /*<-- like so*/

			//b - console.log the response
			console.log(response.data.results); /*<--- like so*/
				//now we can view al; the returned data in our console's browser




////////////////////////////////////////////////////////////////////////////////////////////////////
//Setting State After Async Results
	//Next we want to initialize state in our <App/> component
	state = {images: []} /*whenever we want a state property to contain and object or array we want to
						account for that by initializing with an empty array or empty object*/
		//example: if we call this.state.images.map on state = {images: null} we'll get an error
			//that's b/c .map is a built in property for arrays and if we have an empty array we can perform
			//this task no problem.

	//call setState({}) instead of console.log and fill the images property with response.data.results
	this.setState({ images: response.data.results });

	//print out number of images that we have fetched:
		//In <App/> render(){}:
		<Div>Found: {this.state.images.length}</Div>

		//HOWEVER THIS THROW THE FOLLOWING ERROR: 
			//Uncaught (in promise) TypeError: this.setState is not a function
				//==> value for 'this' that we're referencing is not what we expect it to be:
			//To test this:
				console.log(this); /*in onSearchSubmit method*/
				//We expect 'this' to be an instance of the App class BUT 'this' ==> object w/ the 
				//onSubmit() method: --> {onSubmit: ƒ}
			//The PROBLEM: we have a callback (onSearchSubmit) that we passed down to a CHILD COMPONENT
			/*CHILD: (SearchBar) will call that callback at some point in the future: */ 

			// VALUE OF 'THIS' RULE FOR INSIDE A FUNCTION: (what is the value of 'this' in the () of function(this.a.c)
				this.props.onSubmit(this.state.term);
				/*1 - find function*/ 
					onSubmit(this.state.term);
				/*2 - look to value to the left of the dot, in this case the 'props' object*/ 
					this.props.onSubmit(this.whatever);
				/*3 - THERE FORE 'PROPS' === 'THIS' IN THIS CASE==>*/ this.props.onSubmit(this.state.term);

		//TO FIX THIS: we can either
			//1 - set up constructor function and bind onSearchSubmit within it:
				this.onSearchSubmit.bind(this);

			//2 - bind on searchSubmit in-line with an arrow function:
				onSearchSubmit = async (term) => {};

			//3 - wrap the callback inside an arrow function:
				<SearchBar onSubmit={ () => onSearchSubmit() } />





////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating Custom Clients
	//We're going to do a little bit a code clean up since we have so much code at our app level related to axios

	//Create directory src>api>unsplash.js, import axios;

	/*SYNTAX: */ axios.create({}); 
		/*allows us to create a customized copy of the axios client w/ default props*/

	//Cut headers from <App/> object and paste in axios.create object

	//Cut root URL from onSearchSubmit(){} and copy as baseURL prop in axios.create obj
		axios.create({
			baseURL: 'https://unsplash.com/', 
			Headers:{  }
		});

	//Add export default before axios.create obj: 
		export default axios.create({ baseUrl: 'https://wwww.whatever.com', Headers: {} })

	//cut axios import @ app.js and import new file we've created:
		import unsplash from '../api/unsplash';
	//and replace axios.get with unsplash.get:
		const response = await unsplash.get('/search/photos', {})






