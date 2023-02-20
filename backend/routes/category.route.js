let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();

const ObjectId = mongoose.Types.ObjectId

let categorySchema = require("../models/Category");

// CREATE Category
router.post("/create-category", (req, res, next) => {
  req.body.modified = null; // to be more readable, mongo treats undefineds as nulls
  categorySchema.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

const pipeline =[
  {
    $lookup: {
      from: "users",
      let: {
        searchId: {
          $toObjectId: "$created.by.userId",
        },
      },
      //search query with our [searchId] value
      pipeline: [
        //searching [searchId] value equals your field [_id]
        {
          $match: {
            $expr: [
              {
                _id: "$$searchId",
              },
            ],
          },
        },
        //projecting only fields you reaaly need, otherwise you will store all - huge data loads
        {
          $project: {
            createdBy: "$userName",
          },
        },
      ],
      as: "fromUsers",
    },
  },
  {
    $lookup: {
      from: "users",
      let: {
        searchId: {
          $toObjectId: {
            $cond: [
              {
                $ne: ["$modified", null],
              },
              "$modified.by.userId",
              null,
            ],
          },
        },
      },
      pipeline: [
        {
          $match: {
            $expr: [
              {
                _id: "$$searchId",
              },
            ],
          },
        },
        {
          $project: {
            modifiedBy: {
              $cond: [
                {
                  $ne: ["$$searchId", null],
                },
                "$userName",
                "Unspecfied",
              ],
            },
          },
        },
      ],
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
            $cond: [
              {
                $gt: [
                  {
                    $size: "$fromUsers2",
                  },
                  0,
                ],
              },
              {
                $arrayElemAt: ["$fromUsers2", 0],
              },
              {
                modifiedBy: "Unspec",
              },
            ],
          },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      title: 1,
      level: 1,
      parentCategory: 1,
      created: 1,
      createdBy: 1,
      modified: 1,
      modifiedBy: 1,
    },
  },
]

const pipelineWas = [
  {
    $lookup: {
      from: "users",
      localField: "created.by.userId",
      foreignField: "_id",
      as: "fromUsers",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "modified.by.userId",
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
            $cond: [
              {
                $gt: [
                  {
                    $size: "$fromUsers2",
                  },
                  0,
                ],
              },
              {
                $arrayElemAt: ["$fromUsers2", 0],
              },
              null
            ],
          },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project:
    {
      title: 1,
      createdBy_userName: "$userName", // moze $fromUsers.userName
      role: 1,
      created: 1,
      modified: 1,
      level: 1,
      parentCategory: 1,
      modifiedBy_user: {
        $cond: [
          {
            $gt: [
              {
                $size: "$fromUsers2",
              },
              0,
            ],
          },
          {
            $arrayElemAt: ["$fromUsers2", 0],
          },
          {
            userName: "Unspecified"
          },
        ],
      },
    },
  },
]

// Get Categories
// router.get("/", (req, res, next) => {
//     categorySchema.find((error, data) => {
//         if (error) {
//             return next(error);
//         } else {
//             res.json(data);
//         }
//     });
// });

// Get Categories
router.get('/', async (req, res, next) => {
  categorySchema.aggregate(pipeline, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
})

// Get Categories
router.get('/:id', async (req, res, next) => {
  categorySchema.aggregate([
    {
      $match: {
        parentCategory: req.params.id !== 'null' ? ObjectId(req.params.id) : null
      } 
    },
    ...pipeline
  ], (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
    } else {
      res.json(data);
    }
  });
})


// Get Single Category
router
  .route("/get-category/:id")
  .get((req, res, next) => {
    categorySchema.aggregate([
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

// UPDATE Category
router
  .route("/update-category/:id")
  // Get Single Category
  .get((req, res, next) => {
    categorySchema.findById(
      req.params.id, (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.json(data);
        }
      });
  })

  // Update Category Data
  .put((req, res, next) => {
    categorySchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        returnDocument: 'after'
      },
      (error, data) => {
        if (error) {
          console.log(error);
          return next(error);
        } else {
          res.json(data);
          console.log("Category updated successfully !", data);
        }
      }
    );
  });

// Delete Category
router.delete("/delete-category/:id",
  (req, res, next) => {
    categorySchema.findByIdAndRemove(
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
