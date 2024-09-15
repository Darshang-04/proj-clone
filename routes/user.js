const express = require('express')
const route = express.Router()
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const POST = mongoose.model("POST")
const USER = mongoose.model("USER")

route.get("/user/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            if(!user){
                return res.status(422).json({ error: "User not found" })
            }
            POST.find({ postedBy: req.params.id })
                .populate("postedBy", "_id")
                .then((post) => {    
                    return res.status(200).json({ user, post })
                })
                .catch(err=>{
                    return res.status(422).json({ error: err })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})

route.put('/follow', requireLogin, async (req, res) => {
    const { followId } = req.body;

    try {
        const followedUser = await USER.findByIdAndUpdate(
            followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );
        if (!followedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followingUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: followId } },
            { new: true }
        );
        res.json(followingUser);
    } catch (err) {
        return res.status(422).json({ error: err.message || 'An error occurred' });
    }
});

route.put('/unfollow', requireLogin, async (req, res) => {
    const { followId } = req.body;

    try {
        const followedUser = await USER.findByIdAndUpdate(
            followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );
        if (!followedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followingUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: followId } },
            { new: true }
        );
        res.json(followingUser);
    } catch (err) {
        return res.status(422).json({ error: err.message || 'An error occurred' });
    }
});

route.put('/uploadprofilepic',requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{photo:req.body.pic}
    },{
        new:true
    }).then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error: err})
    })
})


module.exports = route