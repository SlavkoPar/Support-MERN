let mongoose = require("mongoose"),
    express = require("express"),
    router = express.Router();

let User = require("../models/User");

const ObjectId = mongoose.Types.ObjectId

let userSchema = require("../models/User");

// REGISTER User
router.post("/register-user", (req, res, next) => {
    // const { role } = req.body;
    // if (role === 'FIRST_REGISTERED_USER_IS_OWNER') {
    //     req.body.role = 'OWNER';
    //     // TODO set CreatedBy = _id for OWNER
    // }
    userSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});

// REGISTER User
router.post("/sign-in-user", (req, res, next) => {
    User.findOne({ userName: req.body.userName }, function (error, user) {
        console.log(error)
        if (error) {
            return next(error);
        } else {
            console.log(user)
            user.comparePassword(req.body.password, function (error, isMatch) {
                if (error) {
                    return next(error);
                }
                else {
                    console.log(req.body.password, isMatch);
                    res.json(user);
                }
            });
        }
    });
});



// CREATE User
router.post("/create-user", (req, res, next) => {
    // const { role } = req.body;
    // if (role === 'FIRST_REGISTERED_USER_IS_OWNER') {
    //     req.body.role = 'OWNER';
    //     // TODO set CreatedBy = _id for OWNER
    // }
    userSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});


const pipeline = [
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "fromUsers",
        },
    },
    {
        $lookup:
        {
            from: "users",
            localField: "modifiedBy",
            foreignField: "_id",
            as: "fromUsers2",
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: [
                    {
                        $arrayElemAt: ["$fromUsers", 0],
                    },
                    {
                        $arrayElemAt: ["$fromUsers2", 0],
                    },
                    "$$ROOT",
                ],
            },
        },
    },
    {
        $project:
        {
            userName: 1, // only dif from catgories pipeline
            createdBy_userName: "$userName",
            role: 1,
            created: 1,
            modified: 1,
            modifiedBy_userName: {
                $cond: [
                    {
                        $gt: [
                            {
                                $size: "$fromUsers2",
                            },
                            0,
                        ],
                    },
                    "$fromUsers2",
                    '' //'Unspecified'
                ],
            },
        },
    },
]

// READ Users
router.get("/", (req, res, next) => {
    userSchema.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    });
});

// Get Single User
router
    .route("/:id")
    .get((req, res, next) => {
        userSchema.aggregate([
            {
                $match: {
                    _id: ObjectId(req.params.id),
                }
            },
            ...pipeline
        ], (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data[0]);
            }
        });
    })

// UPDATE User
router
    .route("/update-user/:id")
    // Get Single User
    .get((req, res, next) => {
        userSchema.findById(
            req.params.id, (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            });
    })

    // Update User Data
    .put((req, res, next) => {
        userSchema.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            (error, data) => {
                if (error) {
                    console.log(error);
                    return next(error);
                } else {
                    res.json(data);
                    console.log("User updated successfully !");
                }
            }
        );
    });

// Delete User
router.delete("/delete-user/:id",
    (req, res, next) => {
        userSchema.findByIdAndRemove(
            req.params.id, (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.status(200).json({
                        msg: data,
                    });
                }
            });
    });

module.exports = router;
