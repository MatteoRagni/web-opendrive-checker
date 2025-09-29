function transform(xmlDoc, tagName, resultObj) {
  const xmlColl = xmlDoc.getElementsByTagName(tagName)
  if (xmlColl.length) {
    return Array.from(xmlColl).map(x => new resultObj(x))
  }
  return []
}


class Param_ {
  constructor(xmlData) {
    this.name = xmlData.getAttribute("name")
    this.value = xmlData.getAttribute("value")
  }
}


class Metadata_ {
  constructor(xmlData) {
    this.name = xmlData.getAttribute("key")
    this.value = xmlData.getAttribute("value")
    this.description = xmlData.getAttribute("description")
  }
}


class AddressedRule_ {
  constructor(xmlData) {
    this.id = xmlData.getAttribute("ruleUID")
  }
}



class Locations_ {
  constructor(xmlData) {
    const fileLocations = xmlData.getElementsByTagName("FileLocation")
    const xmlLocations = xmlData.getElementsByTagName("XMLLocation")
    const inertialLocations = xmlData.getElementsByTagName("InertialLocation")
    if (fileLocations.length > 0) {
      const fileLocation = fileLocations[0]
      this.hasFileLocation = true
      this.column = fileLocation.getAttribute("column")
      this.row = fileLocation.getAttribute("row")
      this.offset = fileLocation.getAttribute("offset")
    }
    if (xmlLocations.length > 0) {
      const xmlLocation = xmlLocations[0]
      this.hasXmlLocation = true
      this.column = xmlLocation.getAttribute("xpath")
    }
    if (inertialLocations.length > 0) {
      const inertialLocation = inertialLocations[0]
      this.hasInertialLocation = true
      this.x = inertialLocation.getAttribute("x")
      this.y = inertialLocation.getAttribute("y")
      this.z = inertialLocation.getAttribute("z")
    }

    this.description = xmlData.getAttribute("description")
  }
}


class Issue_ {
  constructor(xmlData) {
    this.Locations = transform(xmlData, "Locations", Locations_)

    this.id = xmlData.getAttribute("issueId")
    this.description = xmlData.getAttribute("description")
    this.level = xmlData.getAttribute("level")
    this.ruleId = xmlData.getAttribute("ruleUID")
  }  
}


class Checker_ {
  constructor(xmlData) {
    this.Params = transform(xmlData, "Param", Param_)
    this.Issues = transform(xmlData, "Issue", Issue_)
    this.AddressedRules = transform(xmlData, "AddressedRule", AddressedRule_)
    this.Metadata = transform(xmlData, "Metadata", Metadata_)

    this.id = xmlData.getAttribute("checkerId")
    this.description = xmlData.getAttribute("description")
    this.summary = xmlData.getAttribute("summary")
    this.status = xmlData.getAttribute("status")
  }

  countIssues() {
    return this.Issues.length
  }

  hasIssues() {
    return this.countIssues() > 0
  }
}


class CheckerBundle_ {
  constructor(xmlData) {
    this.Params = transform(xmlData, "Param", Param_)
    this.Checkers = transform(xmlData, "Checker", Checker_)

    this.buildDate = xmlData.getAttribute("build_date")
    this.description = xmlData.getAttribute("description")
    this.name = xmlData.getAttribute("name")
    this.summary = xmlData.getAttribute("summary")
    this.version = xmlData.getAttribute("version")
  }

  countIssues() {
    return this.Checkers.reduce((nIssues, checker) => nIssues + checker.countIssues(), 0)
  }

  hasIssues() {
    return this.countIssues() > 0
  }
}


class CheckerResult_ {
  #data;

  constructor(xmlString) {
    const parser = new DOMParser()
    this.#data = parser.parseFromString(xmlString, "text/xml").documentElement

    this.CheckerBundles = transform(this.#data, "CheckerBundle", CheckerBundle_)
    
    this.version = this.#data.getAttribute("version")
  }
}

export const CheckerResult = CheckerResult_;