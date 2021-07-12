import React from 'react'
import BootstrapCard from "react-bootstrap/Card"
import '../matchingGame.css';


function Card() {
    return (
        <div className=" bootstrapCards ">
            <BootstrapCard className ="h-100" >
                <BootstrapCard.Img variant="top" src="holder.js/100px180" />
                <BootstrapCard.Body>
                    <BootstrapCard.Title>Card Title</BootstrapCard.Title>
                    <BootstrapCard.Text>
                        Put terms here
                    </BootstrapCard.Text>
                </BootstrapCard.Body>
            </BootstrapCard>
        </div>
    )
}

export default Card
