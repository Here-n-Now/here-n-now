import Faker from 'Faker';

    console.log(
      `{
        "type": "Feature",
        "properties": {
          "_id": ${Faker.Internet.ip()},
          "featureclass": "I",
          "text": ${Faker.Lorem.sentence()},
          "Image": ${Faker.Image.imageUrl()},
          "user_id": ${Faker.Internet.userName()}
          "postedAt": firebase.database.ServerValue.TIMESTAMP
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            ${Faker.Address.latitude()},
            ${Faker.Address.longitude()}
          ]
        }
      }`
    )
