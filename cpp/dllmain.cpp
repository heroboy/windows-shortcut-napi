// dllmain.cpp : Defines the entry point for the DLL application.
#include "pch.h"

BOOL APIENTRY DllMain(HMODULE hModule,
	DWORD  ul_reason_for_call,
	LPVOID lpReserved
)
{
	switch (ul_reason_for_call)
	{
	case DLL_PROCESS_ATTACH:
	case DLL_THREAD_ATTACH:
	case DLL_THREAD_DETACH:
	case DLL_PROCESS_DETACH:
		break;
	}
	return TRUE;
}

Napi::Value ReturnError(Napi::Env env, int status, HRESULT hr, const wchar_t* reason)
{
	Napi::Object obj = Napi::Object::New(env);
	obj["status"] = status;
	obj["hr"] = hr;
	obj["reason"] = Napi::String::New(env, (const char16_t*)reason);
	return obj;
}


Napi::Value CreateShortcut(const Napi::CallbackInfo& info)
{
	Napi::Env env = info.Env();

	//0 target
	//1 source
	//2 args
	//3 workingDir
	//4 run style
	//5 icon
	//6 icon index
	//7 hotkey
	//8 description


	auto target = info[0].As<Napi::String>().Utf16Value();
	auto source = info[1].As<Napi::String>().Utf16Value();

	auto HasArg = [&](int i) {
		if (i < info.Length())
		{
			Napi::Value v = info[i];
			if (!v.IsUndefined() && !v.IsNull())
			{
				return true;
			}
		}
		return false;
	};

	HRESULT hr;
	hr = CoInitializeEx(NULL, COINIT_MULTITHREADED);
	if (FAILED(hr))
	{
		return ReturnError(env, -1, hr, L"CoInitializeEx failed");
	}

	struct _OutOfScope
	{
		~_OutOfScope() { CoUninitialize(); }
	} _MyOut;

	CComPtr<IShellLink> pShellLink;
	hr = pShellLink.CoCreateInstance(CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER);
	if (FAILED(hr))
	{
		return ReturnError(env, -2, hr, L"CoCreateInstance failed");
	}

	hr = pShellLink->SetPath((LPCWSTR)source.c_str());
	if (FAILED(hr))
	{
		return ReturnError(env, -3, hr, L"SetPath failed");
	}

	if (HasArg(2))
	{
		auto args = info[2].As<Napi::String>().Utf16Value();
		hr = pShellLink->SetArguments((LPCWSTR)args.c_str());
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetArguments failed");
		}
	}
	if (HasArg(3))
	{
		auto workingDir = info[3].As<Napi::String>().Utf16Value();
		hr = pShellLink->SetWorkingDirectory((LPCWSTR)workingDir.c_str());
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetWorkingDirectory failed");
		}
	}

	if (HasArg(4))
	{
		auto type = info[4].Type();
		auto runStyle = info[4].As<Napi::Number>().Int32Value();
		hr = pShellLink->SetShowCmd(runStyle);
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetShowCmd failed");
		}
	}

	if (HasArg(5))
	{
		auto icon = info[5].As<Napi::String>().Utf16Value();
		int iconIndex = 0;
		if (HasArg(6))
		{
			iconIndex = info[6].As<Napi::Number>().Int32Value();
		}
		hr = pShellLink->SetIconLocation((LPCWSTR)icon.c_str(), iconIndex);
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetIconLocation failed");
		}
	}

	if (HasArg(7))
	{
		auto hotkey = info[7].As<Napi::Number>().Int32Value();
		hr = pShellLink->SetHotkey(hotkey);
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetHotkey failed");
		}
	}
	
	if (HasArg(8))
	{
		auto description = info[8].As<Napi::String>().Utf16Value();
		hr = pShellLink->SetDescription((LPCWSTR)description.c_str());
		if (FAILED(hr))
		{
			return ReturnError(env, -3, hr, L"SetDescription failed");
		}
	}

	CComPtr<IPersistFile> pPersistFile;
	hr = pShellLink.QueryInterface(&pPersistFile);
	if (FAILED(hr))
	{
		return ReturnError(env, -4, hr, L"QueryInterface failed");
	}

	hr = pPersistFile->Save((LPCWSTR)target.c_str(), TRUE);
	if (FAILED(hr))
	{
		return ReturnError(env, -5, hr, L"Save failed");
	}



	return Napi::Value();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(Napi::String::New(env, "CreateShortcut"),
		Napi::Function::New(env, CreateShortcut));
	return exports;
}

NODE_API_MODULE(addon, Init)