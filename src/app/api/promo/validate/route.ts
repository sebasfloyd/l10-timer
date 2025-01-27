import { NextResponse } from 'next/server';

// Lista de códigos válidos (en producción esto debería estar en una base de datos)
const VALID_CODES = {
  'RUPTIVEDEMO': true,
  'FRIENDPASS': true,
  'BETAUSER': true
};

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    // Validar el código
    if (VALID_CODES[code.toUpperCase()]) {
      return NextResponse.json({ 
        valid: true,
        message: 'Code accepted! You now have lifetime access.' 
      });
    }

    return NextResponse.json({ 
      valid: false,
      message: 'Invalid code. Please try again.' 
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Error validating code' },
      { status: 500 }
    );
  }
}