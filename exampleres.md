## signup

```
{
    "user": {
        "id": 5,
        "username": "student",
        "password": "$2b$10$0B2epO3hAmIgik7.fsb4S.DbFbjf40vEhJdaCquPui/9/rLdSB2vG",
        "email": "student@std.com",
        "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0dWRlbnQiLCJpYXQiOjE2MTk1NTQwNDJ9.AeA9yi_cFXPXUM5DAy-OC29eU17A7tBu2Pz0GmRBQx4"
}
```

## Courses 

```
[
    {
        "id": 4,
        "name": "201",
        "img": "https://pc-tablet.com/wp-content/uploads/2020/11/stock-online-course.png",
        "category": "Coding",
        "description": "JavaScript",
        "classes": "ClassOne"
    }
]
```

## Courses/:id

```
{
    "id": 1,
    "name": "Cal",
    "img": "https://pc-tablet.com/wp-content/uploads/2020/11/stock-online-course.png",
    "category": "math",
    "description": "asddqweqweqwe",
    "classes": "Class 1:"
}
```


## Courses/:id/comment

```
{
    "id": 1,
    "student_id": 1,
    "course_id": 1,
    "comment": "good",
    "time": "April 27, 2021 11:56 PM"
}
```

##  student/profile

```
{
    "id": 1,
    "firstname": "zaid",
    "lastname": "alasfar",
    "profilepic": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png",
    "interest": "code",
    "about": null,
    "auth_id": 3,
    "role": "student"
}
```

##  student/courses

```
[
    {
        "firstname": "zaid",
        "name": "Cal"
    },
    {
        "firstname": "zaid",
        "name": "401"
    }
]
```

##  student/courses/1

```
{
        "firstname": "zaid",
        "name": "Cal"
}
```

## student/courses

```
{
    
    "id": 5,
    "student_id": 1,
    "course_id": 5

}
```

## teacher/profile

```
{
    "id": 1,
    "firstname": "ruba",
    "lastname": "banat",
    "profilepic": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png",
    "about": null,
    "auth_id": 2,
    "role": "teacher"
}
```

## teacher/courses

```
[
    {
        "firstname": "ruba",
        "name": "401"
    },
    {
        "firstname": "ruba",
        "name": "301"
    }
]
```

## teacher/courses/2

```
[
    {
        "firstname": "ruba",
        "name": "401"
    }
]
```

## teacher/courses

```
{
    "id": 3,
    "teacher_id": 1,
    "course_id": 5
}
```