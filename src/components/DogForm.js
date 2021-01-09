import React, {useState, useRef} from 'react';
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import Select from 'react-validation/build/select'

import ImageUpload from './ImageUpload'

// Common components we made
import FormGroup from './common/FormGroup'
import BtnSpinner from './common/BtnSpinner'
import NotLoggedIn from './common/NotLoggedIn'
// helpers
import {resMessage} from '../utils/functions.utils'
import {getCurrentUser} from '../services/auth.service'
import {newUserDog} from '../services/dogs.service.js'

const required = (value) => {
  if(!value){
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

const vurl = (value) => {
  const img_regex = /(\.jpg)$|(\.png)$|(\.jpeg$)/
  if(!value.match(img_regex)){
    return (
      <div className="alert alert-danger" role="alert">
        Must be a valid image (jpeg, jpg, or png)
      </div>
    )
  }
}

const textLengthBio = (value) => {
  if(value.length>500){
    return (
      <div className="alert alert-danger" role="alert">
        Must be less than 500 characters
      </div>
    )
  }
}

const textLengthTemp = (value) => {
  if(value.length>25){
    return (
      <div className="alert alert-danger" role="alert">
        One or two words will suffice
      </div>
    )
  }
}


const DogForm = (props) => {
  const form = useRef()
  const checkBtn = useRef()


  const [message,setMessage] = useState("")
  const [loading,setLoading] = useState(false)
  const [successful, setSuccessful] = useState(false)
  const [data,setData] = useState(
    {
      name:"",
      picture_url:"",
      biography:"",
      breed:"",
      temperament:"",
      age:"",
      size:1,
      min_age:"",
      max_age:"",
      min_size:1,
      max_size:3,
      }
    )

  const handleChange = (e) =>{
    setData({...data,[e.target.name]:e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")
    // use the library to validate all fields on the form
    form.current.validateAll()
    // check on ages and sizes
    if(data.min_age>data.max_age){
      setMessage("Min age must be less than max age")
      return
    }
    if(data.min_size>data.max_size){
      setMessage("Min size must be less than max size")
      return
    }
    setLoading(true)
    // check min_age lte max_age and same for size
    if(checkBtn.current.context._errors.length === 0){
      setLoading(false)
      console.log(data)
      newUserDog(data).then((response)=>{
        setMessage(`Successfully added ${data.name}`)
        setSuccessful(true)
        setLoading(false)
        setTimeout(()=>{
          props.history.push('/profile')
        },200)
      },
      (error)=>{
        setSuccessful(false)
        setLoading(false)
        setMessage(resMessage(error))
      }
    )} else {
      setSuccessful(false)
      setLoading(false)
    }
  }

  const display = () => {
    return !getCurrentUser() ?
    <NotLoggedIn/>
    : (
      <div className="col-md-12">
        <div className="card">
          <Form onSubmit={handleSubmit} ref={form}>

            <FormGroup text="Dog's Name">
              <Input
                type="text"
                className="form-control"
                name="name"
                value={data.name}
                onChange={handleChange}
                validations={[required]}
              />
            </FormGroup>
            <ImageUpload />
            {/* <FormGroup text='Link to Picture'>
              <Input
                type="text"
                className="form-control"
                name="picture_url"
                value={data.picture_url}
                onChange={handleChange}
                validations={[required,vurl]}
              /> */}
            {/* </FormGroup> */}

            <FormGroup text="Short Bio">
              <Input
                type="text"
                className="form-control"
                name="biography"
                value={data.biography}
                onChange={handleChange}
                validations={[required,textLengthBio]}
              />
            </FormGroup>

            <FormGroup text="Temperament">
              <Input
                type="text"
                className="form-control"
                name="temperament"
                value={data.temperament}
                onChange={handleChange}
                validations={[required,textLengthTemp]}
              />
            </FormGroup>

            <FormGroup text="Breed">
              <Input
                type="text"
                className="form-control"
                name="breed"
                value={data.breed}
                onChange={handleChange}
                validations={[required,textLengthTemp]}
              />
            </FormGroup>

            <FormGroup text="Age">
              <Input
                type="number"
                className="form-control"
                name="age"
                value={data.age}
                onChange={handleChange}
                validations={[required]}
              />
            </FormGroup>


            <FormGroup text='Size'>
              <Select
                name='size'
                className="form-control"
                value={data.size}
                onChange={handleChange}
                validations={[required]}>
                <option value='1'>Small</option>
                <option value='2'>Medium</option>
                <option value='3'>Large</option>
              </Select>
            </FormGroup>

            {/* Preferences */}
            <h3>Preferences</h3>
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="min_age">Min Age</label>
                <Input
                  type="number"
                  className="form-control"
                  name="min_age"
                  value={data.min_age}
                  onChange={handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="inputState">Max Age</label>
                <Input
                  type="number"
                  className="form-control"
                  name="max_age"
                  value={data.max_age}
                  onChange={handleChange}
                  validations={[required]}
                />
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="inputState">Min Size</label>
                <Select
                  className="form-control"
                  name="min_size"
                  value={data.min_size}
                  onChange={handleChange}
                  validations={[required]}>
                  <option value='1'>Small</option>
                  <option value='2'>Medium</option>
                  <option value='3'>Large</option>
                </Select>
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="inputState">Max Size</label>
                <Select
                  className="form-control"
                  name="max_size"
                  value={data.max_size}
                  onChange={handleChange}
                  validations={[required]}>
                  <option value='1'>Small</option>
                  <option value='2'>Medium</option>
                  <option value='3'>Large</option>
                </Select>
              </div>
            </div>




            <BtnSpinner loading={loading} text="Create Dog"/>

           {message && (
               <div className='form-group'>
                   <div className={successful ? 'alert alert-success':'alert alert-danger'} role='alert'>
                       {message}
                   </div>
               </div>
           )}
           <CheckButton style={{display:'none'}} ref={checkBtn} />
          </Form>
        </div>
      </div>
    )
  }
  return display()
}

export default DogForm;
