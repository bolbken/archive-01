import './SeasonDisplay.css'
import React from 'react'


const seasonConfig = {
    summer: {
        text: 'Lets hit the beach!',
        iconName: 'sun'
    },
    winter: {
        text: 'Burr it is chilly...',
        iconName: 'snowflake'
    }
}

const getSeason = (lat, month) => {
    if(month > 2 && month < 9) {
        // JS terinary element:  If lat is greater than 0 (true) value returns summer, (false) returns winter
        return lat > 0 ? 'summer' : 'winter';
    }

    if(month < 3 || month > 8 ) {
        return lat > 0 ? 'winter' : 'summer';
    }
}

// It is good practice to put the react component at the bottom of the js file.
const SeasonDisplay = (props) => {

    const season = getSeason(props.lat, new Date().getMonth());
 
    const { text, iconName } = seasonConfig[season];

    return(
        <div className={`season-display ${season}`}>
            {/* below call is for a semantic ui icon,  note the way to call the string using the icon string*/}
            <i className={`icon-left massive ${iconName} icon`} />
            <h1>{text}</h1>
            <i className={`icon-right massive ${iconName} icon`} />
        </div>
    );
}

export default SeasonDisplay;