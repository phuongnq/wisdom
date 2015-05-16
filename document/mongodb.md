# MongoDB collections

## users
```
{
    "_id" : "dWNSnpo8TSKZkkgbZ",
    "createdAt" : ISODate("2015-05-16T05:24:40.644Z"),
    "services" : {
        "facebook" : {
            "accessToken" : "CAANHttCxP9UBAJQY2Tj5givvXtJF4BUFejthZBjNDptrT9wcJ9COXFZB763qTKHLl4wEG7G3sEjGgCj2j5Tf1Cpumij9xoZCsSHypQSFL9ZBnpBlUprbpkqBd9SAgA54mFrJksgxld7Wm6vemaQvyth5zBmNFZA7HMnK8ME2QNT35cZCPJ2RHwPbjzvxKDT5mVZCif6uYMJNj3QvncDFjP0",
            "expiresAt" : 1436929177557,
            "id" : "10204323862438064",
            "email" : "nquangphuong@gmail.com",
            "name" : "Nguyen Quang Phuong",
            "first_name" : "Phuong",
            "last_name" : "Nguyen Quang",
            "link" : "https://www.facebook.com/app_scoped_user_id/10204323862438064/",
            "gender" : "male",
            "locale" : "en_US"
        },
        "resume" : {
            "loginTokens" : [ 
                {
                    "when" : ISODate("2015-05-16T05:25:08.777Z"),
                    "hashedToken" : "P54k4C08RxrB21auM6AfRuxffecdQe/ZWiSrkSh9GWg="
                }
            ]
        }
    },
    "point" : 100
}
```

## contests
```
"_id": Meteor default id
"subject": subject name (Mathematics, Physics, Chemistry, Biology, Informatics, Geography, English)
"name": String
"start_at": timestamp
"max_entries": max number of allowed entries
"prize_structure": [{
  "winners": number of winners for this rank
  "value": value in W-point for this rank
}]
"questions": [{
  "text": full text of the question
  "answers": [{
    "code": answer code (a-z)
    "text": full text of the answer
  }]
  "cost": cost in score to answer
  "reward": reward in score if answered correctly
  "correct_answer": answer code (a-z) --> Do not send this to client
}]
```

## entries
```
"_id": Meteor default id
"contest_id": contest id
"user_id": user id
"user_first_name": user first name
"score": user score in contest
"question": current question number
"rank": user rank in contests
"winning": user winning W-point in contest
"answers": [answer_code]
```
