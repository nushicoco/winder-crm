import React from 'react'
import { Button } from 'react-bootstrap'

export default class CSVExport extends React.Component {

    removeCommas (str) {
        return [str].join().replace(/,/g,';')
    }

    createUri (data) {
        let csvContent = 'data:text/csv;charset=utf-8,'
        data.forEach((infoArray, index) => {
            const dataString = infoArray.map(this.removeCommas).join(',') // ('o') ('-') ('_')
            csvContent += dataString
            if (index < data.length) {
                csvContent += '\n'
            }
        })
        return encodeURI(csvContent)
    }

    render () {
        return (
            <div className="inline">
              <Button
                style={ {float: 'left'} }
                onClick = { () => { this.a.click() } }
                bsSize="xsmall">
                CSV
              </Button>
              <a
                href={ this.createUri(this.props.data) }
                download={ this.props.filename }
                ref={ (ref) => this.a = ref } />
            </div>
        )
    }
}
