import React from 'react'
import './Calendar.css'

const Calendar = () => {
  return (
    <div className='container'>
        <div className='calender-app'>
            <div className='calendar'>
                <h1 className='heading'>Calendar</h1>

                <div className='navigate-date'>
                    <h2 className='month'>Agosto,</h2>
                    <h2 className='year'>2025</h2>
                    <div className='buttons'>
                        <i class="fa fa-arrow-left" ></i>
                        <i class="fa fa-arrow-right" ></i>
                    </div>
                </div>
                <div className='weekdays'>
                    <span>Seg</span>
                    <span>Ter</span>
                    <span>Qua</span>
                    <span>Qui</span>
                    <span>Sex</span>
                    <span>Sáb</span>
                    <span>Dom</span>
                </div>
                <div className='days'>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span className='current-date'>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                    <span>11</span>
                    <span>12</span>
                    <span>13</span>
                    <span>14</span>
                    <span>15</span>
                    <span>16</span>
                    <span>17</span>
                    <span>18</span>
                    <span>19</span>
                    <span>20</span>
                    <span>21</span>
                    <span>22</span>
                    <span>23</span>
                    <span>24</span>
                    <span>25</span>
                    <span>26</span>
                    <span>27</span>
                    <span>28</span>
                    <span>29</span>
                    <span>30</span>
                    <span>31</span>
                </div>
            </div>
            <div className='events'>
                <div className='event-popup'>
                    <div className='time-input'>
                        <div className='event-popup-time'>Dias</div>
                        <input type='number' name='days' min={1} max={31} className='days' />
                        <input type='number' name='days' min={1} max={31} className='days'/>
                    </div>
                    <button className='event-popup-btn'>Alugar</button>
                    <button className='close-event-popup'><i class="fa-solid fa-x"></i></button>
                </div>
                <div className='event'>
                    <div className='event-date-wrapper'>
                        <div className='event-date'>7 Agosto, 2025</div>
                        <div className='event-time'>15:00</div>
                    </div>
                    <div className='event-text'>Aluger da Strelicia</div>
                    <div className='event-buttons'>
                       <i class="fa-solid fa-x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Calendar
