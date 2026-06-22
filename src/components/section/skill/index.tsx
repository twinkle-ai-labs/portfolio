import React from 'react';
import {ISKill} from "@Data/skill";
import {Rating} from "@mui/material";

const Skill = (props: ISKill) => {
    return (
        <div className="skill-box" data-color={props.color}>
            <div className="icon" style={{color: props.color}}>{props.icon}</div>
            <div className="name">{props.name}</div>
            {props.rating? (
                <div className="rating">
                    <Rating value={props.rating} precision={0.5} max={3} size="small" readOnly/>
                </div>
            ): ''}
        </div>
    );
};

export default Skill;
