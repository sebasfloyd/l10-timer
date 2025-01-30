// /app/api/promo/validate/route.ts
import { NextResponse } from 'next/server';

interface PromoCodes {
  [key: string]: boolean;
}

// Lista de códigos válidos (en producción esto debería estar en una base de datos)
const VALID_CODES: PromoCodes = {
  'RUPTIVEDEMO': true,
  'CATIF_FREE': true,
  'FRIENDPASS': true,
  'BETAUSER': true
};

export async function POST(req: Request) {
  try {
    // Intentar parsear el cuerpo de la solicitud
    const body = await req.json() as { code: string };
    console.log('Received body:', body);

    const { code } = body;

    if (typeof code !== 'string') {
      console.warn('Invalid code type:', typeof code);
      return NextResponse.json({ 
        valid: false,
        message: 'Invalid code format. Please provide a valid code.' 
      }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase();
    console.log('Normalized code:', normalizedCode);

    // Validar el código
    if (VALID_CODES[normalizedCode]) {
      console.log('Valid promo code:', normalizedCode);
      return NextResponse.json({ 
        valid: true,
        message: 'Code accepted! You now have lifetime access.' 
      });
    }

    console.warn('Invalid promo code:', normalizedCode);
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
