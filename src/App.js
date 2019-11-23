import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import {Bar} from 'react-chartjs-2';

import './App.css';

export default function Form() {

  const [state, setState] = React.useState(
    {
      principal: 100,
      coupon: 1,
      issue: 1905,
      maturity: 1945,
      sinking: 3
    }
  );
  const handleChange = event => {
    let a = event.target.id
    let s = event.target.value
    if (event.target.role === 'option') {
      a = (event.target.id.substr(0, event.target.id.indexOf('-')));
      s = (event.target.innerText === "undefined" ? event.target.value: event.target.innerText );
    }
    console.log(state.principal)
    console.log(state.coupon)
    console.log(state.issue)
    console.log(state.maturity)
    console.log(state.sinking)
    setState({
      ...state,
      [a]: s
    });
  }
  const checkCoupon = event => {
    let a = event.target.id
    let s = event.target.value
    setState({
      ...state,
      [a]: s
    });
  }
  return (
    <div>
      <Container>

        <Grid container justify = "center" className="Container-box">
        <Grid container justify = "center" className="Head">
          The sinking goat
        </Grid>
          <form onChange={handleChange} >

            <Grid container justify = "center">
              <Grid item xs={6}>
                <TextField id="principal" label="Principal" type="number" variant="outlined" value={state.principal} />
              </Grid>
              <Grid item xs={2}>

              </Grid>
              <Grid item xs={4}>
                <Input id="coupon" label="Coupon" type="number" onInput = {(e) =>{
                  e.target.value = Math.min(Math.max(parseInt(e.target.value), 0), 100);
                  }} variant="outlined" value={state.coupon} endAdornment={<InputAdornment position="end">%</InputAdornment>}/>
              </Grid>
            </Grid>
          <Grid container justify = "center">
            <Grid item xs={3}>
                <Autocomplete
                    id="issue"
                    options={yearIssue}
                    autoHighlight
                    getOptionLabel={value => value.toString()}
                    onChange={handleChange}
                    renderInput={params => (
                      <TextField {...params} label="Issue" variant="standard" fullWidth />
                    )}
                />
              </Grid>
              <Grid item xs={3}>
                  <Autocomplete
                      id="maturity"
                      options={yearMaturity}
                      autoHighlight
                      getOptionLabel={value => value.toString()}
                      onChange={handleChange}
                      renderInput={params => (
                        <TextField {...params}  label="Maturity" variant="standard" fullWidth />
                      )}
                  />
              </Grid>
              <Grid item xs={3}>
              </Grid>              
              <Grid item xs={3}>
              <Input id="sinking" label="Sinking fund" type="number" onInput = {(e) =>{
                e.target.value = Math.min(Math.max(parseInt(e.target.value), 0), 100);
              }} variant="outlined" value={state.sinking} endAdornment={<InputAdornment position="end">%</InputAdornment>}/>

              </Grid>
            </Grid>
          </form>
        </Grid>
        <Bar data={data(state.principal,state.coupon,state.issue,state.maturity,state.sinking)} />

      </Container>
    </div>
  )
}
function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}
const yearIssue = range(1800, new Date().getFullYear());
const yearMaturity = range(1800, new Date().getFullYear());






function chartRange(start, end, step = 1) {
  if(end-start<100 && end-start>0) {
    console.log('yep')
    const len = Math.floor((end - start) / step) + 1
    return Array(len).fill().map((_, idx) => start + (idx * step))
  }
  else {
    start = Math.max(start,end)
    end = Math.max(start,end) + 1
    const len = Math.floor((end - start) / step) + 1
    return Array(len).fill().map((_, idx) => start + (idx * step))
  }
}

function data(fvti,ir,i,m,sf) {
  return({
    labels: chartRange(i,m),
    datasets: [
      {
        label: 'The sinking goat',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: interestFlow(fvti,sf,i,m, sf)
      }
    ]
  });
}

function cashFlow(fvt, ir) {
  return (fvt*ir*0.01)
}

function interestFlow(fvti, ir, ti, tm, sf) {
  let type = 'cummultaive';
  let sfundi
  let sfund = []
  let fvt = []
  fvt[0] = fvti
  sfund[0] = 0
  sfund[1] = sf*fvt[0]

  for(let i=1; i<tm-ti; i++) {


      fvti = fvt[i-1] - sfund[i-1]
      sfundi = sf*fvt[0] + ir*0.01*(fvt[0]-fvti)
      fvt[i] = fvti;
      sfund[i] = sfundi


  }
  return(sfund);
}





// SINKING FUND FORMUA

// principal t1 = princpal t0 - sinkingfund*principal t0 / (preu)
