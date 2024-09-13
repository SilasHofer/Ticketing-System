const LocalStrategy = require("passport-local").Strategy
const helpers = require("./src/helpers.js");
const bcrypt = require("bcrypt");
function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await helpers.user_by_email(email)
        if (user[0] == null) {
            return done(null, false, { message: "no user found!" })
        }

        try {
            if (await bcrypt.compare(password, user[0].password_hashed)) {
                return done(null, user[0].idUsers)
            } else {
                return done(null, false, { message: "password wrong" })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))
    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser(async (id, done) => {
        return done(null, await helpers.user_by_id(id))
    })
}

module.exports = initialize
