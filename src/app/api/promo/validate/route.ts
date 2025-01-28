import { NextResponse } from 'next/server';

interface PromoCodes {
  [key: string]: boolean;
}

// Lista de códigos válidos (en producción esto debería estar en una base de datos)
const VALID_CODES: PromoCodes = {
  'RUPTIVEDEMO': true,
  'FRIENDPASS': true,
  'BETAUSER': true
};

export async function POST(req: Request) {
  try {
    const { code } = await req.json() as { code: string };
    const normalizedCode = code.toUpperCase();

    // Validar el código
    if (VALID_CODES[normalizedCode]) {
      return NextResponse.json({ 
        valid: true,
        message: 'Code accepted! You now have lifetime access.' 
      });
    }

    return NextResponse.json({ 
      valid: false,
      message: 'Invalid code. Please try again.' 
    }, { status: 400 });

  } catch (err) {
    console.error('Error validating code:', err);
    return NextResponse.json(
      { error: 'Error validating code' },
      { status: 500 }
    );
  }
}