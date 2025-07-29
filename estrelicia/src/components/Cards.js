import React from 'react'
import CardItem from './CardItem'
import './Cards.css'

function Cards() {
  return (
    <div className='cards'>
        <h1>Strelicia House</h1>
        <h3> Piscina Aquecida • Jacuzzi • Natureza </h3>
        <div className='cards_container'>
            <div className='cards_wrapper'>
                <ul className='cards_items'>
                    <CardItem src='images/Img2.jpg' text='Reservas' label = 'Reservas' path="/Rent" />
                    <CardItem src='images/Img3.jpg' text='Calendário' label = 'Calendário' path="/Calender" />
                </ul>
                <ul className='cards_items'>
                    <CardItem src='images/Img4.jpg' text='Condições' label = 'Condições' path="https://drive.google.com/file/d/1KYuK4iDIww87NqKzCzXbZd-FILB7eR9Z/view" />
                    <CardItem src='images/Img5.jpg' text='Google Maps' label = 'Localização' path="https://www.google.com/maps/place/STRELICIAHOUSE/@41.6255095,-8.2929654,17z/data=!3m1!4b1!4m6!3m5!1s0xd251d51a3fbdae9:0xea8e161cb7667980!8m2!3d41.6255055!4d-8.2903905!16s%2Fg%2F11vyx0hs93?entry=tts&g_ep=EgoyMDI1MDUxNS4wIPu8ASoASAFQAw%3D%3D&skid=8ab9edb5-52ad-4f5f-8373-6858d77966c9" />
                </ul>
            </div>
        </div>
    </div>
  )
  
}

export default Cards
