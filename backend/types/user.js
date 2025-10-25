import zod from 'zod';

const userRegestrationSchema = zod.object({
  firstName: zod.string().min(3).max(30),
  lastName: zod.string().min(3).max(30),
  email: zod.string(),
  password: zod.string().min(6).max(100),
});

export const validateUserRegistration = (req,res,next) => {
  const result = userRegestrationSchema.safeParse(req.body);
  if (result.success) {
    next()
  } else {
    return res.status(400).json({message: "Invalid request data", error: result.error});
  } 
};

const userLoginSchema = zod.object({
  email: zod.email("Invalid email format"),
  password: zod.string().min(6).max(100),
});

export const validateUserLogin = (next,req,res) => {
  const result = userLoginSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    return res.status(400).json({message: "Invalid request data", error: result.error});
  }
};