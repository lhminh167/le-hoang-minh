"use client"
import { defaultGetOutputAmountForm, GetOutputAmountForm, GetOutputAmountRequestValidator, isValidForm } from "@/components/HomePage/HomePageModel";
import { getOutputAmount, getTokens } from "@/components/HomePage/HomePageService";
import ForwardIcon from '@mui/icons-material/Forward';
import { Backdrop, CircularProgress, Container, Fab, FormControl, FormHelperText, Grid2, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Image from 'next/image';
import { useEffect, useState } from "react";

export default function HomePage() {
  const [state, setState] = useState<GetOutputAmountForm>(defaultGetOutputAmountForm);

  useEffect(() => {
    setState({
      ...state,
      isLoading: true,
    })
    getTokens().then(response => {
      setState({
        ...state,
        tokens: response.payload.tokens,
        isLoading: false
      })
    })
  }, [])

  async function submit() {
    const validator = new GetOutputAmountRequestValidator()
    const error = validator.validate(state);
    if (!isValidForm(error)) {
      setState({
        ...state,
        submitted: true,
        error: error as any,
      })
      return;
    }
    setState({
      ...state,
      isLoading: true,
    })
    const response = await getOutputAmount({
      inputCurrency: state.inputCurrency,
      outputCurrency: state.outputCurrency,
      inputAmount: Number(state.inputAmount),
    })
    setState({
      ...state,
      isLoading: false,
      submitted: false,
      outputAmount: response.payload.outputAmount
    })
  }

  function change(event: any) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({
      ...state,
      [name]: value,
    });
  }

  return (
    <Container>
      <Grid2 container>
        <Grid2
          size={12}
          component={Typography}
          variant="h1"
          sx={{
            fontSize: 40,
            textAlign: 'center',
            mt: 10,
            mb: 5
          }}
        >
          Fancy Form
        </Grid2>
        <Grid2 size={12} container>
          <Grid2
            size={{ xs: 12, sm: 5 }}
          >
            <FormControl
              fullWidth
              error={state.error.inputCurrency as any && state.submitted}
            >
              <InputLabel
                id='inputCurrency'
              >
                Currency to send
              </InputLabel>
              <Select
                name='inputCurrency'
                labelId='inputCurrency'
                id='inputCurrency'
                value={state.inputCurrency}
                onChange={change}
              >
                {state.tokens.map(token =>
                  <MenuItem
                    key={token}
                    value={token}
                  >
                    <Stack
                      direction='row'
                      spacing={1}
                    >
                      <Image
                        src={`https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${token}.svg`}
                        width={25}
                        height={25}
                        alt={token}
                      />
                      <Typography fontSize={18}>{token}</Typography>
                    </Stack>
                  </MenuItem>
                )}
              </Select>
              {
                state.error.inputCurrency && state.submitted &&
                <FormHelperText
                  error
                >
                  {state.error.inputCurrency}
                </FormHelperText>
              }
            </FormControl>
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='inputAmount'
              label='Amount to send'
              name='inputAmount'
              value={state.inputAmount}
              onChange={change}
              error={state.error.inputAmount as any && state.submitted}
              helperText={state.error.inputAmount && state.submitted ? state.error.inputAmount : null}
            />
          </Grid2>
          <Grid2
            container
            size={{ xs: 12, sm: 2 }}
            sx={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid2
              component={ForwardIcon}
              fontSize={80}
              sx={{
                rotate: {
                  xs: '90deg',
                  sm: '0deg'
                }
              }}
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 5 }}
          >
            <FormControl
              fullWidth
              error={state.error.outputCurrency as any && state.submitted}
            >
              <InputLabel
                id='outputCurrency'
              >
                Currency to receive
              </InputLabel>
              <Select
                name='outputCurrency'
                labelId='outputCurrency'
                id='outputCurrency'
                value={state.outputCurrency}
                onChange={change}
              >
                {state.tokens.map(token =>
                  <MenuItem
                    key={token}
                    value={token}
                  >
                    <Stack
                      direction='row'
                      spacing={1}
                    >
                      <Image
                        src={`https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${token}.svg`}
                        width={25}
                        height={25}
                        alt={token}
                      />
                      <Typography fontSize={18}>{token}</Typography>
                    </Stack>
                  </MenuItem>
                )}
              </Select>
              {
                state.error.outputCurrency && state.submitted &&
                <FormHelperText
                  error
                >
                  {state.error.outputCurrency}
                </FormHelperText>
              }
            </FormControl>
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='outputAmount'
              label='Amount to receive'
              name='outputAmount'
              value={state.outputAmount}
            />
          </Grid2>
        </Grid2>
        <Grid2
          size={12}
          sx={{
            mt: 5,
          }}
        >
          <Grid2
            size={12}
            component={Fab}
            variant="extended"
            color="primary"
            onClick={submit}
          >
            CONFIRM SWAP
          </Grid2>
        </Grid2>
      </Grid2>
      <Backdrop
        open={state.isLoading}
        sx={(theme) => ({ color: 'white', zIndex: theme.zIndex.drawer + 1 })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
