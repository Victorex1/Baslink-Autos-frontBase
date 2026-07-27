const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const superbaseURL = process.env.superbaseURL;
const superbaseKEY = process.env.superbaseKEY;

passport.serializeUser((user,done) => {
  done(null,user.id)
})
passport.deserializeUser(async (id,done) => {
  try{
     const response = await fetch(`${superbaseURL}users?id=eq.${id}`,
          {
            method: "GET",
            headers: {
              apikey: superbaseKEY,
              Authorization: `Bearer ${superbaseKEY}`,
            },
          },
        );

        const userid = await response.json();
        done(null,userid)
  }catch(err){
        console.log("Data base Error:", err);

  }
         
})


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // Changed https to http for local development
      callbackURL: "http://localhost:5000/android-stereo/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // You must handle or pass the user profile to Passport:
      // done(null, profile);
      try {
        const response = await fetch(
          `${superbaseURL}users?id=eq.${profile.id}`,
          {
            method: "GET",
            headers: {
              apikey: superbaseKEY,
              Authorization: `Bearer ${superbaseKEY}`,
            },
          },
        );

        const userid = await response.json();

        if (userid[0]) {
          console.log('user Already Exist:',userid)
          done(null,profile)
        } else {
          const response = await fetch(`${superbaseURL}users`, {
            method: "POST",
            headers: {
              apikey: superbaseKEY,
              Authorization: `Bearer ${superbaseKEY}`,
              "Content-Type": "application/json",
              prefer: "return=representation",
            },
            body: JSON.stringify({
              id: profile.id,
              userName: profile.displayName,
              thumbNail: profile.photos[0].value,
            }),
          });

          const profileSet = await response.json();
          done(null,profile)
        }
      } catch (err) {
        console.log("Data base Error:", err);
      }
    },
  ),
);
