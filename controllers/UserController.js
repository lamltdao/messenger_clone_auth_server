const User = require('../models/User')

module.exports = {
    getUserById: async (req,res) => {
        try {
            const {userId} = req.payload
            const user = await User.findById(userId)
            if(user == null) return res.status(404).json("User not found")
            return res.status(200).json(user)
        }
        catch {
            return res.status(500).json("Internal error")
        }

    },
    getAllContacts: async (req, res) => {
        try {
            const {userId} = req.payload
            const user = await User.findById(userId).populate('contacts').exec()
            if(user == null) return res.status(404).json("User not found")
            const {contacts} = user
            return res.status(200).json(contacts)
        }
        catch {
            return res.status(500).json("Internal Error")
        }
    },
    addUserToContact: async (req, res) => {
        try {
            const {friendId} = req.body // Id of user to be added to contact
            const {userId} = req.payload
            const user = await User.findById(userId)
            if(user == null) return res.status(404).json("User not found")
            const {contacts} = user 
            contacts.push(friendId)
            await user.save()
            return res.status(201).json("Successfully add user to contact")
        }
        catch {
            return res.status(500).json("Internal error")
        }
    }
}