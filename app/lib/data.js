/*
* Library for storing data
*
*/
//Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for the module to eb exported
var lib = {};
// Base dir
lib.baseDir = path.join(__dirname,'/../.data/');


// write data to a file
lib.create = function(dir,file,data,callback){
  // open file for write
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      // convert data to string
      var stringData = JSON.stringify(data);

      // write to file and close
      fs.writeFile(fileDescriptor,stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
};


// Read data from a file
lib.read = function(dir,file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
    if(!err && data){
      var parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData);
    } else {
      callback(err,data);
    }

  })
};


// Update file
lib.update = function(dir,file,data,callback){
  // open for write
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      // convert data to string
      var stringData = JSON.stringify(data);
      //Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // write to the file and close it
          // write to file and close
          fs.writeFile(fileDescriptor,stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('error truncating file');
        }
      });

    } else {
      callback('Could not create new file, it may not exist yet');
    }
  });
};

// Delete a file
lib.delete = function(dir,file,callback){
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
    if(!err){
      callback(false);
    } else {
      callback('Could not delete file');
    }
  });
};

// Export the module
module.exports = lib;
