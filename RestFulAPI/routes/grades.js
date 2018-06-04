var express = require('express');
var router = express.Router();
const GradeDao = require('../dao/gradeDao');
const { check, validationResult } = require('express-validator/check');

/* GET grades listing. */
router.get('/', function(req, res, next) {
  //res.writeHead(200, {"Content-Type": "application/json"});
  let json=JSON.stringify(GradeDao.getGrades(),null,'\t');
  res.status(200).end(json);
});

/* Add grade in grades list */
router.post('/', [check('name').isLength({min:1}).withMessage('Name must not be empty'),
check('course').isLength({min:1}).withMessage('Course must not be empty'),
check('grade').isLength({min:1}).withMessage('Grade must not be empty')], function(req, res, next) {
  
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  req.assert('name', 'name is required').notEmpty();
  
  GradeDao.addGrade(req.body).then((data)=>{res.status(200).end(data);})
                                    .catch((err)=>{res.status(500).end(err);})
});

/* GET specific grade information. */
router.get('/:id', function(req, res, next) {
  GradeDao.getGrade(req.params.id).then((result)=>{
    res.status(200).end(JSON.stringify(result, null,'\t'));
  }).catch((err)=>{
    res.status(500).end(err);
  });
});

module.exports = router;
