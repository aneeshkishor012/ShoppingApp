'use client';

import React, { startTransition } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useActionState } from 'react'; // This hook is available in React 19 (which is installed) or Canary. If not, use generic state.
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Note: authenticate action needs to handle the formData. 
  // useActionState signature: [state, action, isPending]
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    // Since we want to redirect to callbackUrl, ideally we pass it to the server action
    // But the current authenticate action in actions.ts creates the redirect internally.
    // We can stick to the action's existing logic which likely hardcodes or implies redirection.
    // However, looking at the previous user edit, they wanted to use callbackUrl.
    // The previous actions.ts authenticate function calls `signIn` from next-auth.
    // next-auth signIn handles callbackUrl if passed as second argument options.

    // For now, let's just trigger the formAction and let actions.ts handle it.
    // If actions.ts calls signIn which defaults to /, that's fine. 
    // If we want to enforce callbackUrl, we might need to update actions.ts or pass it as hidden input.
    formData.append('redirectTo', callbackUrl);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div style={{ padding: '0 12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.5rem' }}>Please log in to continue.</h2>

      <Form
        name="login_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email address' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            disabled={isPending}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            disabled={isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isPending}>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div style={{ minHeight: 48 }}>
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon />
        )}
      </div>
    </div>
  );
}