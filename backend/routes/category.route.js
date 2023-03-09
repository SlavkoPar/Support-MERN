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

const arrPipeline = [
  {
    $lookup: {
      from: "questions",
      localField: "_id",
      foreignField: "parentCategory",
      pipeline: [
        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: "fromQuestions",
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
      numOfQuestions: { $size: "$fromQuestions"}
    },
  },

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
      numOfQuestions: 1
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
  categorySchema.aggregate(arrPipeline, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
})


// Get child Categories
router.get('/:id', async (req, res, next) => {
  categorySchema.aggregate([
    {
      $match: {
        parentCategory: req.params.id !== 'null' ? ObjectId(req.params.id) : null
      }
    },
    ...arrPipeline
    // {
    //   $lookup: {
    //     from: "questions",
    //     localField: "_id",
    //     foreignField: "parentCategory",
    //     pipeline: [
    //       {
    //         $project: {
    //           _id: 1
    //           //title: 1,
    //           //parentCategory: 1,
    //           //created: 1,
    //           // createdBy: 1,
    //           // modified: 1,
    //           // modifiedBy: 1,
    //         },
    //       },
    //     ],
    //     as: "questions",
    //   },
    //}       
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
      ...arrPipeline,
      /*{
        $lookup: {
          from: "questions",
          let: {
            // searchId: {
            //   $toObjectId: "$_id",
            // },
            searchId: "$_id"
          },
          //search query with our [searchId] value
          pipeline: [
            //searching [searchId] value equals your field [_id]
            {
              $match: {
                $expr: [
                  {
                    parentCategory: "$$searchId",
                  },
                ],
              },
            },
            //projecting only fields you reaaly need, otherwise you will store all - huge data loads
            {
              $project: {
                title: 1,
                // created: 1,
                // createdBy: 1,
                // modified: 1,
                // modifiedBy: 1,
              },
            },
          ],
          as: "questions",
        },
      }*/
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "parentCategory",
          pipeline: [
            {
              $project: {
                title: 1,
                parentCategory: 1,
                level: 1,
                created: 1,
                // createdBy: 1,
                // modified: 1,
                // modifiedBy: 1,
              },
            },
          ],  
          as: "questions",
        },
      }      
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
