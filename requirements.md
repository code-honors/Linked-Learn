# Software Requirements
## Vision
These days the world is moving too fast and we need to keep up with it, and with the current situation and how hard it became to attend courses and meet people to learn from, we thought about a web app that helps people do that.


## Scope In
- The web app will provide courses for students and give them the ability to enroll.
- The web app will give the users the ability to sign up and have an account with certain authorities.
- The web app will allow users to search for courses to see the details.
- The web app will allow Instructor users to add new courses
- The web app will have a calender to schedule meetings
- The web app will give the users the ability to enter meetings with an Instructor or with a group

## Scope Out
- The web app will not have subscription

### Minimum Viable Product
- Create profile (Instructor / Student)
- Instructors can add courses
- Students can search for courses / add the course to their profile
- 1 to 1 session between (Instructor / Student) // schedule meeting
- Group sessions between students
- Calendar 
- Feedback / review section for course / instructor
- Admin account

### Stretch
- Users can add each other as friends and see what courses their friend enrolled in
- Teachers can be students for other courses 
- More profile features

## Functional Requirements

### Data flow
when a guest enters the website, they'll see the home page with all courses, and a signup button, after they signup, they can enroll in courses, have a profile page, see all their courses, and a calendar. if an instructor signed up, they'll be able to create courses and schedule meetings with students.

## Non-Functional Requirements

**Security**
We are going to use Oauth system to let users login to our webapp without using a password, even they sign up using a username and password we will encrypt the password before even storing it to the database using libraries like bcrypt, also the using of jwt to send the token between the front end and the server will add another security layer to our webapp.

**Testability**
We will test each function in our app using libraries like jest and supergoose to make sure that our app is working properly under any case scenario, also libraries like eslint will test any syntax errors before the code is pushed to the repo.