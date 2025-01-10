import { CreateLogger } from '$_lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url. {
	prepend: '(worker)',
	color: 'deepturqoise'
})

SAY('WORKER CREATED')

import * as comlink from 'comlink'
import * as Proxies from '$ad3_core_backend'
import { SingletonLocal } from './_SingletonLocal.js'

globalThis.singleton = new SingletonLocal( true )
comlink.expose( globalThis.singleton )