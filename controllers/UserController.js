const User = require('../models/User')

module.exports = {
    getUserByJwt: async (req,res) => {
        try {
            const {userId} = req.payload
            const user = await User.findById(userId).select('_id name email contacts').populate('contacts', '_id name email')
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

            // return _id, email, name only in populated field 
            const user = await User.findById(userId).populate('contacts', '_id name email')
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
            const {contactId} = req.body // Id of user to be added to contact
            const {userId} = req.payload
            const user = await User.findById(userId)
            if(user == null) return res.status(404).json("User not found")
            const {contacts} = user 
            contacts.push(contactId)
            try {
                await user.save()
            }
            catch {
                return res.status(400).json('Bad Input')
            }
            return res.status(201).json("User added to contact")
        }
        catch {
            return res.status(500).json("Internal error")
        }
    }
}