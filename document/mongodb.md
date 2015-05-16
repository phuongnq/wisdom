# MongoDB collections

## users
```
"_id": Meteor default id
"point": user total W-point
"fb_id": facebook id <currentUser.services.facebook.id>
"full_name": <currentUser.services.facebook.name>
"first_name": <currentUser.services.facebook.first_name>
"last_name": <currentUser.services.facebook.last_name>
"link": <currentUser.services.facebook.link>
"gender": <currentUser.services.facebook.gender>
"locale": <currentUser.services.facebook.locale>
```

## subjects
```
"_id": Meteor default id
"name": String
```

## contests
```
"_id": Meteor default id
"subject_id": subject id
"name": String
"start_at": timestamp
"entries": [{
  "user_id": user id
  "user_first_name": user first name
  "score": user score in contest
  "question": current question number
  "rank": user rank in contests
  "winning": user winning W-point in contest
}]
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