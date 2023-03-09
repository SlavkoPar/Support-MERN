let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();

const ObjectId = mongoose.Types.ObjectId

let questionSchema = require("../models/Question");

// CREATE Question
router.post("/create-question", (req, res, next) => {
  req.body.modified = null; // to be more readable, mongo treats undefineds as nulls
  questionSchema.create(req.body, (error, data) => {
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

// Get Questions
// router.get("/", (req, res, next) => {
//     questionSchema.find((error, data) => {
//         if (error) {
//             return next(error);
//         } else {
//             res.json(data);
//         }
//     });
// });

// Get Questions
router.get('/', async (req, res, next) => {
  questionSchema.aggregate(pipeline, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
})

// Get Questions
router.get('/:id', async (req, res, next) => {
  questionSchema.aggregate([
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


// Get Single Question
router
  .route("/get-question/:id")
  .get((req, res, next) => {
    questionSchema.aggregate([
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

// UPDATE Question
router
  .route("/update-question/:id")
  // Get Single Question
  .get((req, res, next) => {
    questionSchema.findById(
      req.params.id, (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.json(data);
        }
      });
  })

  // Update Question Data
  .put((req, res, next) => {
    questionSchema.findByIdAndUpdate(
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
          console.log("Question updated successfully !", data);
        }
      }
    );
  });

// Delete Question
router.delete("/delete-question/:id",
  (req, res, next) => {
    questionSchema.findByIdAndRemove(
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
