#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')
ObjC.import('Foundation')

const app = Application.currentApplication();
app.includeStandardAdditions = true


function run(argv) {
    try {
        return selectCommand(argv)
    } catch (e) {
        return e
    }
}

function selectCommand(argv) { 

    const cmd = argv[0]

    if (cmd === 'list') {
        return list('all')
    }

    $.exit(0)
}

/**
 * Commands
 */

// Build the list 
function list() {
    
    // init an empty object to hold the results 
    var result = { 'items': [] }
    
    // the csv file 
    var file = "~/Code/script-filler-test/list.csv";

    // read the csv file
    // TODO this line raises an error in Alfred debugger
    var csv = app.read( Path(file) )

    // split the csv string into an array of rows
    var rows = csv.split('\r\n')

    // get the headers row 
    var headers = rows[0].split(',');
    
    // drop the header row 
    rows.splice(0,1)
    
    // iterate through the rows 
    rows.forEach( (row) => {

        // init an empty object to hold the results 
        var obj = {}

        // split the row into an array of attributes
        var currentRow = row.split(',')

        // iterate through the headers 
        headers.forEach( (header,i) => {
            // add the key/value pair to the obj container
            obj[header] = currentRow[i]
        })

        // sets other attributes that may be needed by Alfred
        obj["autocomplete"] = obj["title"]
        obj["subtitle"]     = obj["title"]
        obj["arg"]          = obj["uid"]
        
        // push the current row object into the results array
        result.items.push(obj)
    })

    return JSON.stringify(result)

}