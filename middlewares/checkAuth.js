module.exports = {
    // must have user loggin in to access route
    checkAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) { // passport function
            return next()
        }
        res.redirect('/login')
    },

    // no user logged in in order to access route
    checkNotAuthenticated: (req,res,next) => {
        if(req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}